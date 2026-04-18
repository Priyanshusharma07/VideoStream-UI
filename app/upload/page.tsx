"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { UploadIcon, VideoIcon, CheckCircleIcon } from "@/components/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { uploadVideo } from "@/services/video.service";

// ─── Types ────────────────────────────────────────────────────────────────────

type Visibility = "public" | "unlisted" | "private";

type UploadPhase = "idle" | "presign" | "upload" | "confirm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function phaseLabel(phase: UploadPhase, progress: number): string {
  if (phase === "presign") return "Getting upload URL…";
  if (phase === "upload") return `Uploading to cloud… ${progress}%`;
  if (phase === "confirm") return "Finalizing…";
  return "";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();
  const abortRef = useRef<AbortController | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [done, setDone] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = phase !== "idle";

  // ── File handling ──────────────────────────────────────────────────────────

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) {
      toast.push({
        variant: "error",
        title: "Unsupported file",
        message: "Please select a video file (mp4, webm, or mov).",
      });
      return;
    }
    setFile(f);
    setDone(false);
    setVideoId(null);
    setProgress(0);
    setErrorMsg(null);
    setPhase("idle");
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (isBusy) return;
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isBusy) return;
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  }

  function cancelUpload() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBusy || !file || !title.trim()) return;

    setErrorMsg(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await uploadVideo({
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        isPublic: visibility === "public",
        signal: controller.signal,
        onProgress: (currentPhase, pct) => {
          setPhase(currentPhase);
          setProgress(pct);
        },
      });

      setVideoId(String(result.videoId));
      setDone(true);
      toast.push({ variant: "success", title: "Upload complete! Video is processing." });
      router.push(`/videos/${result.videoId}?processing=1`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.push({ variant: "info", title: "Upload cancelled" });
      } else {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";

        if (message.toLowerCase().includes("not authenticated") ||
            message.toLowerCase().includes("sign in")) {
          toast.push({ variant: "error", title: "Please sign in to upload" });
          router.push("/login");
          return;
        }

        setErrorMsg(message);
        toast.push({ variant: "error", title: "Upload failed", message });
      }
    } finally {
      abortRef.current = null;
      setPhase("idle");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <StreamHubLogo />
          <Link
            href="/dashboard"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="rounded-3xl bg-black/35 p-8 ring-1 ring-white/10 backdrop-blur">
          <h1 className="text-2xl font-semibold">Upload Video</h1>
          <p className="mt-1 text-sm text-white/50">
            Share your content with the world. Supports MP4, MOV, WebM.
          </p>

          {/* ── Success state ── */}
          {done ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-emerald-500/10 p-10 text-center ring-1 ring-emerald-400/20">
              <CheckCircleIcon className="h-12 w-12 text-emerald-400" />
              <div className="text-xl font-semibold">Upload Complete!</div>
              <p className="text-sm text-white/60">
                <span className="font-medium text-white/90">&ldquo;{title}&rdquo;</span> is
                processing. It will be available shortly.
              </p>
              {videoId && (
                <p className="text-xs text-white/40">Video ID: {videoId}</p>
              )}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setTitle("");
                    setDescription("");
                    setTags("");
                    setProgress(0);
                    setDone(false);
                    setVideoId(null);
                    setErrorMsg(null);
                  }}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
                >
                  Upload Another
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-sky-400"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              {/* Drop zone */}
              <div
                id="upload-dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isBusy) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => {
                  if (!isBusy) fileRef.current?.click();
                }}
                className={[
                  "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition",
                  isBusy ? "cursor-not-allowed opacity-60" : "",
                  dragging
                    ? "border-cyan-400/60 bg-cyan-400/5"
                    : file
                      ? "border-emerald-400/50 bg-emerald-400/5"
                      : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5",
                ].join(" ")}
              >
                <input
                  ref={fileRef}
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={onFileChange}
                  disabled={isBusy}
                />
                {file ? (
                  <>
                    <VideoIcon className="h-10 w-10 text-emerald-400" />
                    <div className="text-sm font-semibold text-white/90">{file.name}</div>
                    <div className="text-xs text-white/45">
                      {formatBytes(file.size)} •{" "}
                      {isBusy ? "Upload in progress…" : "Click to change"}
                    </div>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-10 w-10 text-white/30" />
                    <div className="text-sm font-semibold text-white/70">
                      Drag &amp; drop your video here
                    </div>
                    <div className="text-xs text-white/40">or click to browse</div>
                    <div className="text-xs text-white/30">MP4 · MOV · WebM</div>
                  </>
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="upload-title"
                  className="mb-2 block text-xs font-medium text-white/60"
                >
                  TITLE <span className="text-red-400">*</span>
                </label>
                <input
                  id="upload-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a title…"
                  disabled={isBusy}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="upload-description"
                  className="mb-2 block text-xs font-medium text-white/60"
                >
                  DESCRIPTION
                </label>
                <textarea
                  id="upload-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video…"
                  rows={3}
                  disabled={isBusy}
                  className="w-full resize-none rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="upload-tags"
                  className="mb-2 block text-xs font-medium text-white/60"
                >
                  TAGS <span className="text-white/30">(comma-separated)</span>
                </label>
                <input
                  id="upload-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="gaming, tutorial, react…"
                  disabled={isBusy}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="mb-3 block text-xs font-medium text-white/60">
                  VISIBILITY
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["public", "unlisted", "private"] as Visibility[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      id={`visibility-${v}`}
                      onClick={() => setVisibility(v)}
                      disabled={isBusy}
                      className={[
                        "rounded-xl px-3 py-2.5 text-xs font-semibold capitalize transition ring-1",
                        visibility === v
                          ? "bg-sky-500/20 text-sky-300 ring-sky-500/40"
                          : "bg-white/5 text-white/60 ring-white/10 hover:bg-white/10 hover:text-white",
                        isBusy ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              {isBusy && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>{phaseLabel(phase, progress)}</span>
                    {phase === "upload" && <span>{progress}%</span>}
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-200"
                      style={{
                        width:
                          phase === "presign"
                            ? "5%"
                            : phase === "upload"
                              ? `${Math.max(5, progress)}%`
                              : "98%",
                      }}
                    />
                  </div>
                  {phase === "upload" && (
                    <p className="text-xs text-white/35">
                      Uploading directly to cloud storage. This may take a moment for
                      large files.
                    </p>
                  )}
                </div>
              )}

              {/* Error message */}
              {errorMsg && !isBusy && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-400/20"
                >
                  {errorMsg}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {isBusy ? (
                  <button
                    id="cancel-upload-btn"
                    type="button"
                    onClick={cancelUpload}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
                  >
                    Cancel Upload
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
                  >
                    Cancel
                  </Link>
                )}

                <button
                  id="publish-video-btn"
                  type="submit"
                  disabled={!file || !title.trim() || isBusy}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UploadIcon className="h-4 w-4" />
                  {isBusy ? "Uploading…" : "Publish Video"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Upload flow info */}
        {!done && !isBusy && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { step: "01", label: "Select video", desc: "Pick your .mp4, .mov, or .webm file" },
              { step: "02", label: "Upload to cloud", desc: "Streams directly to S3 — fast & secure" },
              { step: "03", label: "Processing", desc: "Your video is transcoded automatically" },
            ].map(({ step, label, desc }) => (
              <div
                key={step}
                className="rounded-2xl bg-white/3 px-4 py-5 ring-1 ring-white/8"
              >
                <div className="text-xs font-bold text-sky-400 mb-1">{step}</div>
                <div className="text-xs font-semibold text-white/80">{label}</div>
                <div className="mt-1 text-xs text-white/40">{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
