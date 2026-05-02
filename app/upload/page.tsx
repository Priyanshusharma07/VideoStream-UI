"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon, VideoIcon, CheckCircleIcon } from "@/components/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { uploadVideo } from "@/services/video.service";
import { getAccessToken } from "@/lib/auth-session";

// ─── Types ────────────────────────────────────────────────────────────────────

type Visibility = "public" | "unlisted" | "private";

type UploadPhase = "idle" | "presign" | "upload" | "confirm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function phaseLabel(phase: UploadPhase, progress: number): string {
  if (phase === "presign") return "Authenticating Upload URL…";
  if (phase === "upload") return `Uploading cinematic assets… ${progress}%`;
  if (phase === "confirm") return "Finalizing publication…";
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
        message: "Please select a cinematic video file.",
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
      // Get token from localStorage (Paseto)
      const token = getAccessToken();

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
        token,
        signal: controller.signal,
        onProgress: (currentPhase, pct) => {
          setPhase(currentPhase);
          setProgress(pct);
        },
      });

      setVideoId(String(result.videoId));
      setDone(true);
      toast.push({ variant: "success", title: "Success!", message: "Your video is now being processed." });
      router.push(`/watch/${result.videoId}?processing=1`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.push({ variant: "info", title: "Cancelled", message: "Upload was aborted." });
      } else {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setErrorMsg(message);
        toast.push({ variant: "error", title: "Upload failed", message });
      }
    } finally {
      abortRef.current = null;
      setPhase("idle");
    }
  }

  return (
    <div className="py-12 px-[5vw]">
      <div className="mx-auto w-full max-w-xl">
        <div className="glass-panel p-10 rounded-[2.5rem]">
          <h1 className="text-3xl font-black text-white tracking-tight">Upload Cinematic</h1>
          <p className="mt-2 text-white/50 font-medium">
            Share your masterpiece with the world. Supports up to 8K resolution.
          </p>

          {done ? (
            <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl bg-primary/5 p-12 text-center border border-primary/20">
              <CheckCircleIcon className="h-16 w-16 text-primary" />
              <div>
                <div className="text-2xl font-black text-white mb-2">Upload Successful!</div>
                <p className="text-white/60 font-medium max-w-xs mx-auto">
                  Your project <span className="text-primary">&ldquo;{title}&rdquo;</span> is being rendered.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null); setTitle(""); setDescription(""); setTags("");
                    setProgress(0); setDone(false); setVideoId(null); setErrorMsg(null);
                  }}
                  className="rounded-2xl bg-white/5 px-6 py-3 font-bold text-white border border-white/10 hover:bg-white/10"
                >
                  New Upload
                </button>
                <Link
                  href="/"
                  className="rounded-2xl bg-primary px-8 py-3 font-black text-black hover:brightness-110 shadow-lg shadow-primary/20"
                >
                  Home Feed
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 space-y-8">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); if (!isBusy) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => { if (!isBusy) fileRef.current?.click(); }}
                className={`
                  flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed p-12 text-center transition-all duration-300
                  ${isBusy ? "cursor-not-allowed opacity-50" : ""}
                  ${dragging ? "border-primary bg-primary/10 scale-[0.98]" : file ? "border-primary/40 bg-primary/5" : "border-white/10 bg-white/2 hover:border-primary/50 hover:bg-primary/5"}
                `}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={onFileChange}
                  disabled={isBusy}
                />
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <VideoIcon className="h-8 w-8" />
                    </div>
                    <div className="text-base font-bold text-white leading-tight">{file.name}</div>
                    <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      {formatBytes(file.size)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-primary transition-colors">
                      <UploadIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-white/80">Select master file</div>
                      <div className="text-sm text-white/40 mt-1">or drag and drop here</div>
                    </div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">4K • HDR • MP4</div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-xs font-black text-white/40 uppercase tracking-widest">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter production title..."
                    disabled={isBusy}
                    className="w-full rounded-2xl bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-xs font-black text-white/40 uppercase tracking-widest">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the cinematic vision..."
                    rows={4}
                    disabled={isBusy}
                    className="w-full resize-none rounded-2xl bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Visibility */}
                <div className="grid grid-cols-3 gap-3">
                  {(["public", "unlisted", "private"] as Visibility[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVisibility(v)}
                      disabled={isBusy}
                      className={`
                        rounded-2xl py-3 text-[11px] font-black uppercase tracking-widest transition-all border
                        ${visibility === v ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"}
                      `}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {isBusy && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-primary">{phaseLabel(phase, progress)}</span>
                    <span className="text-white/40">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300 shadow-[0_0_15px_rgba(179,197,255,0.5)]"
                      style={{ width: `${Math.max(5, progress)}%` }}
                    />
                  </div>
                </div>
              )}

              {errorMsg && !isBusy && (
                <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm font-bold text-red-400 border border-red-500/20">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link
                  href="/"
                  className="flex-1 rounded-2xl bg-white/5 py-4 text-sm font-bold text-white text-center border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!file || !title.trim() || isBusy}
                  className="flex-[2] rounded-2xl bg-primary py-4 text-sm font-black text-black hover:brightness-110 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:brightness-100 transition-all"
                >
                  {isBusy ? "Publishing Assets..." : "Publish Cinematic"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

