"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls, { type Level } from "hls.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type QualityLevel = { index: number; label: string; height: number };

type Props = {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onFirstPlay?: () => void;
};

type PlayerState =
  | "idle"
  | "loading"
  | "buffering"
  | "playing"
  | "paused"
  | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQualityLabel(level: Level): string {
  if (!level) return "Auto";
  const h = level.height;
  if (h >= 1080) return "1080p";
  if (h >= 720) return "720p";
  if (h >= 480) return "480p";
  if (h >= 360) return "360p";
  return `${h}p`;
}

/** Format seconds → "m:ss" or "h:mm:ss" */
function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HlsPlayer({ src, poster, autoPlay = false, onFirstPlay }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef   = useRef<Hls | null>(null);
  const seekBarRef = useRef<HTMLDivElement | null>(null);
  // Track whether the user is actively dragging the scrubber
  const isDragging = useRef(false);

  const [state, setState]               = useState<PlayerState>("idle");
  const [error, setError]               = useState<string | null>(null);
  const [levels, setLevels]             = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [showQuality, setShowQuality]   = useState(false);
  const [volume, setVolume]             = useState(1);
  const [muted, setMuted]               = useState(autoPlay); // start muted when autoPlay
  const [showUnmuteBanner, setShowUnmuteBanner] = useState(false);

  // ── Seek / progress state ──────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  // buffered end (seconds) — for the buffered progress track
  const [bufferedEnd, setBufferedEnd] = useState(0);

  const firedFirstPlay = useRef(false);

  // ── HLS init ───────────────────────────────────────────────────────────────

  const initHls = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);
    setState("loading");
    setCurrentTime(0);
    setDuration(0);
    setBufferedEnd(0);

    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1,
        abrEwmaDefaultEstimate: 500_000,
        capLevelToPlayerSize: true,
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
        enableWorker: true,
        fragLoadingMaxRetry: 3,
        fragLoadingRetryDelay: 1000,
        manifestLoadingMaxRetry: 3,
        levelLoadingMaxRetry: 3,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        const qs: QualityLevel[] = data.levels.map((l, i) => ({
          index: i,
          label: buildQualityLabel(l),
          height: l.height,
        }));
        setLevels(qs);
        setCurrentLevel(-1);
        if (autoPlay) {
          video.muted = true;
          setMuted(true);
          video.play()
            .then(() => setShowUnmuteBanner(true))
            .catch(() => null);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setCurrentLevel(data.level));

      let networkRetries = 0;
      const MAX_NETWORK_RETRIES = 3;

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          if (networkRetries < MAX_NETWORK_RETRIES) {
            networkRetries++;
            setTimeout(() => hls.startLoad(), 1000 * networkRetries);
          } else {
            setError("Network error — could not load video segments.");
            setState("error");
          }
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          setError("Playback error — unable to load stream.");
          setState("error");
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, () => { networkRetries = 0; });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (autoPlay) {
        video.muted = true;
        setMuted(true);
        video.play()
          .then(() => setShowUnmuteBanner(true))
          .catch(() => null);
      }
    } else {
      setError("Your browser does not support HLS playback.");
      setState("error");
    }
  }, [src, autoPlay]);

  useEffect(() => {
    initHls();
    return () => { hlsRef.current?.destroy(); hlsRef.current = null; };
  }, [initHls]);

  // ── Video element events (state + seek tracking) ───────────────────────────

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting      = () => setState("buffering");
    const onPlaying      = () => {
      setState("playing");
      setError(null);
      if (!firedFirstPlay.current) {
        firedFirstPlay.current = true;
        onFirstPlay?.();
      }
    };
    const onPause        = () => setState("paused");
    const onStalled      = () => setState("buffering");

    // ── Seek / duration tracking ─────────────────────────────────────────────
    const onTimeUpdate   = () => {
      if (!isDragging.current) setCurrentTime(video.currentTime);
    };
    const onDuration     = () => {
      if (isFinite(video.duration)) setDuration(video.duration);
    };
    // Buffered ranges — update after each chunk loads
    const onProgress     = () => {
      if (video.buffered.length > 0) {
        // Report the end of the last buffered range
        setBufferedEnd(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onSeeked       = () => setCurrentTime(video.currentTime);

    video.addEventListener("waiting",        onWaiting);
    video.addEventListener("playing",        onPlaying);
    video.addEventListener("pause",          onPause);
    video.addEventListener("stalled",        onStalled);
    video.addEventListener("timeupdate",     onTimeUpdate);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("progress",       onProgress);
    video.addEventListener("seeked",         onSeeked);

    return () => {
      video.removeEventListener("waiting",        onWaiting);
      video.removeEventListener("playing",        onPlaying);
      video.removeEventListener("pause",          onPause);
      video.removeEventListener("stalled",        onStalled);
      video.removeEventListener("timeupdate",     onTimeUpdate);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("progress",       onProgress);
      video.removeEventListener("seeked",         onSeeked);
    };
  }, [onFirstPlay]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const video = videoRef.current;
      if (!video) return;
      // Ignore if user is typing in an input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          video.paused ? video.play().catch(() => null) : video.pause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          setVolume(video.volume);
          break;
        case "ArrowDown":
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          setVolume(video.volume);
          break;
        case "m":
          video.muted = !video.muted;
          setMuted(video.muted);
          if (!video.muted) setShowUnmuteBanner(false);
          break;
        case "f":
          if (document.fullscreenElement) document.exitFullscreen().catch(() => null);
          else (video.parentElement ?? video).requestFullscreen().catch(() => null);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Seekbar pointer interaction (click + drag) ─────────────────────────────

  function seekToFraction(fraction: number) {
    const video = videoRef.current;
    if (!video || !isFinite(video.duration)) return;
    const t = Math.max(0, Math.min(1, fraction)) * video.duration;
    video.currentTime = t;
    setCurrentTime(t);
  }

  function getFractionFromEvent(e: React.PointerEvent | PointerEvent): number {
    const bar = seekBarRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  }

  function onSeekBarPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    seekToFraction(getFractionFromEvent(e));
  }

  function onSeekBarPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const f = getFractionFromEvent(e);
    setCurrentTime(Math.max(0, Math.min(1, f)) * (duration || 0));
  }

  function onSeekBarPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    isDragging.current = false;
    seekToFraction(getFractionFromEvent(e));
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (bufferedEnd  / duration) * 100 : 0;

  function setQuality(index: number) {
    const hls = hlsRef.current;
    if (!hls) return;
    hls.currentLevel = index;
    setCurrentLevel(index);
    setShowQuality(false);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) setShowUnmuteBanner(false);
  }

  function onVolumeChange(v: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    video.muted  = v === 0;
    setVolume(v);
    setMuted(v === 0);
    if (v > 0) setShowUnmuteBanner(false);
  }

  const activeLabel =
    currentLevel === -1
      ? "Auto"
      : levels.find((l) => l.index === currentLevel)?.label ?? "Auto";

  const showBuffering = state === "buffering" || state === "loading";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-black">

      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        playsInline
        controls={false}
        preload="auto"
        muted={muted}
        className="h-full w-full object-cover"
        id="hls-video-player"
      />

      {/* Unmute banner */}
      {showUnmuteBanner && !error && (
        <button
          type="button"
          aria-label="Unmute video"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = false; v.volume = 1;
            setMuted(false); setVolume(1); setShowUnmuteBanner(false);
          }}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
          Tap to unmute
        </button>
      )}

      {/* Buffering Spinner */}
      {showBuffering && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-sky-400" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-8 text-center">
          <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm font-medium text-white/90">{error}</p>
          <button type="button" onClick={initHls} className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-black hover:bg-sky-400">
            Retry
          </button>
        </div>
      )}

      {/* ── Controls Bar ───────────────────────────────────────────────────── */}
      {!error && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-12 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

          {/* ── Seekbar row ──────────────────────────────────────────────── */}
          <div className="mb-2 flex items-center gap-2">
            {/* Current time */}
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/80">
              {fmtTime(currentTime)}
            </span>

            {/* Progress track */}
            <div
              ref={seekBarRef}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              tabIndex={0}
              className="relative h-[18px] flex-1 cursor-pointer select-none"
              onPointerDown={onSeekBarPointerDown}
              onPointerMove={onSeekBarPointerMove}
              onPointerUp={onSeekBarPointerUp}
              onPointerCancel={onSeekBarPointerUp}
              /* keyboard seek via arrow keys handled globally above */
            >
              {/* Track background */}
              <div className="absolute inset-y-[7px] w-full rounded-full bg-white/20" />

              {/* Buffered indicator */}
              <div
                className="absolute inset-y-[7px] rounded-full bg-white/30 transition-[width] duration-300"
                style={{ width: `${bufferedPct}%` }}
              />

              {/* Played fill */}
              <div
                className="absolute inset-y-[7px] rounded-full bg-sky-400"
                style={{ width: `${progressPct}%` }}
              />

              {/* Scrubber thumb — visible on hover / drag */}
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `${progressPct}%` }}
              />
            </div>

            {/* Duration */}
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/50">
              {fmtTime(duration)}
            </span>
          </div>

          {/* ── Buttons row ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Play / Pause */}
            <button
              type="button"
              id="hls-play-pause-btn"
              aria-label={state === "playing" ? "Pause" : "Play"}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.paused ? v.play().catch(() => null) : v.pause();
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              {state === "playing" ? (
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip back 10 s */}
            <button
              type="button"
              aria-label="Rewind 10 seconds"
              onClick={() => {
                const v = videoRef.current;
                if (v) v.currentTime = Math.max(0, v.currentTime - 10);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                <text x="8.5" y="15" fontSize="5" fill="white" fontFamily="sans-serif">10</text>
              </svg>
            </button>

            {/* Skip forward 10 s */}
            <button
              type="button"
              aria-label="Forward 10 seconds"
              onClick={() => {
                const v = videoRef.current;
                if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                <text x="8.5" y="15" fontSize="5" fill="white" fontFamily="sans-serif">10</text>
              </svg>
            </button>

            {/* Volume button */}
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              {muted || volume === 0 ? (
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              )}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min={0} max={1} step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-16 cursor-pointer accent-sky-400"
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Quality Switcher */}
            {levels.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  id="hls-quality-btn"
                  onClick={() => setShowQuality((v) => !v)}
                  className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                >
                  {activeLabel} ▾
                </button>
                {showQuality && (
                  <div className="absolute bottom-full right-0 mb-2 min-w-[90px] overflow-hidden rounded-xl border border-white/10 bg-[#12161F] shadow-xl">
                    <button
                      type="button"
                      onClick={() => setQuality(-1)}
                      className={[
                        "w-full px-3 py-2 text-left text-[12px] hover:bg-white/5",
                        currentLevel === -1 ? "font-semibold text-sky-400" : "text-white/80",
                      ].join(" ")}
                    >
                      Auto
                    </button>
                    {[...levels].reverse().map((l) => (
                      <button
                        key={l.index}
                        type="button"
                        onClick={() => setQuality(l.index)}
                        className={[
                          "w-full px-3 py-2 text-left text-[12px] hover:bg-white/5",
                          currentLevel === l.index ? "font-semibold text-sky-400" : "text-white/80",
                        ].join(" ")}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              aria-label="Fullscreen"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (document.fullscreenElement) document.exitFullscreen().catch(() => null);
                else (v.parentElement ?? v).requestFullscreen().catch(() => null);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
