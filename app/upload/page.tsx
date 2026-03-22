"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { UploadIcon, VideoIcon, CheckCircleIcon } from "@/components/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { uploadVideoMultipart } from "@/lib/videos-client";

type Visibility = "public" | "unlisted" | "private";
type UploadStatus = "idle" | "uploading";

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
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [videoId, setVideoId] = useState<string | null>(null);

  const isBusy = status !== "idle";

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) {
      toast.push({
        variant: "error",
        title: "Unsupported file",
        message: "Please select a video file (video/*).",
      });
      return;
    }
    setFile(f);
    setDone(false);
    setVideoId(null);
    setProgress(0);
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
  }

  function cancelUpload() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBusy) return;
    if (!file || !title.trim()) return;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setProgress(0);
      setStatus("uploading");

      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await uploadVideoMultipart({
        file,
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        isPublic: visibility === "public",
        signal: controller.signal,
        onProgress: (p) => setProgress(p),
      });

      if (!result.ok) {
        if (result.error.code === "unauthorized") {
          toast.push({ variant: "error", title: "Please login to upload" });
          router.push("/login");
          return;
        }
        toast.push({
          variant: "error",
          title: "Upload failed",
          message: result.error.message,
        });
        return;
      }

      setVideoId(String(result.data.videoId));
      setDone(true);
      toast.push({ variant: "success", title: "Upload complete" });

      router.push(`/videos/${result.data.videoId}?processing=1`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.push({ variant: "info", title: "Upload canceled" });
      } else {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast.push({ variant: "error", title: "Upload failed", message });
      }
    } finally {
      abortRef.current = null;
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <StreamHubLogo />
          <Link
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="rounded-3xl bg-black/35 p-8 ring-1 ring-white/10 backdrop-blur">
          <h1 className="text-2xl font-semibold">Upload Video</h1>
          <p className="mt-1 text-sm text-white/50">
            Share your content with the world. Supports MP4, MOV, WebM.
          </p>

          {done ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-emerald-500/10 p-10 text-center ring-1 ring-emerald-400/20">
              <CheckCircleIcon className="h-12 w-12 text-emerald-400" />
              <div className="text-xl font-semibold">Upload Complete!</div>
              <p className="text-sm text-white/60">
                <span className="font-medium text-white/90">&ldquo;{title}&rdquo;</span> is processing. It will be available shortly.
              </p>
              {videoId ? (
                <p className="text-xs text-white/45">Video ID: {videoId}</p>
              ) : null}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setFile(null); setTitle(""); setDescription(""); setTags(""); setProgress(0); setDone(false); }}
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
                onDragOver={(e) => { e.preventDefault(); if (!isBusy) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => { if (!isBusy) fileRef.current?.click(); }}
                className={[
                  "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition",
                  isBusy ? "opacity-60 cursor-not-allowed" : "",
                  dragging
                    ? "border-cyan-400/60 bg-cyan-400/5"
                    : file
                      ? "border-emerald-400/50 bg-emerald-400/5"
                      : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5",
                ].join(" ")}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                {file ? (
                  <>
                    <VideoIcon className="h-10 w-10 text-emerald-400" />
                    <div className="text-sm font-semibold text-white/90">{file.name}</div>
                    <div className="text-xs text-white/45">
                      {(file.size / 1024 / 1024).toFixed(1)} MB • Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-10 w-10 text-white/30" />
                    <div className="text-sm font-semibold text-white/70">
                      Drag &amp; drop your video here
                    </div>
                    <div className="text-xs text-white/40">or click to browse</div>
                  </>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  TITLE <span className="text-red-400">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a title..."
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video..."
                  rows={3}
                  className="w-full resize-none rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  TAGS <span className="text-white/30">(comma separated)</span>
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="gaming, tutorial, react..."
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 transition"
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
                      onClick={() => setVisibility(v)}
                      className={[
                        "rounded-xl px-3 py-2.5 text-xs font-semibold capitalize transition ring-1",
                        visibility === v
                          ? "bg-sky-500/20 text-sky-300 ring-sky-500/40"
                          : "bg-white/5 text-white/60 ring-white/10 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {isBusy && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {isBusy ? (
                  <button
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
                  type="submit"
                  disabled={!file || !title.trim() || isBusy}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UploadIcon className="h-4 w-4" />
                  {isBusy ? "Uploading..." : "Publish Video"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
