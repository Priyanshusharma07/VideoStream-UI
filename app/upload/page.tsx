"use client";

import Link from "next/link";
import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon, VideoIcon, CheckCircleIcon, PlayIcon, InfoIcon } from "@/components/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { useUploads } from "@/context/UploadContext";
import { getAccessToken } from "@/lib/auth-session";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Cinema", slug: "cinema", icon: "movie" },
  { label: "Gaming", slug: "gaming", icon: "sports_esports" },
  { label: "Music", slug: "music", icon: "music_note" },
  { label: "Tech", slug: "tech", icon: "developer_mode" },
  { label: "Documentary", slug: "documentary", icon: "menu_book" },
  { label: "Sports", slug: "sports", icon: "fitness_center" },
  { label: "Animation", slug: "animation", icon: "animation" },
];

const STEPS = ["Select Media", "Project Details", "Publication"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function phaseLabel(phase: string, progress: number): string {
  if (phase === "presign") return "Authenticating Cinematic Stream…";
  if (phase === "upload") return `Transferring Assets… ${progress}%`;
  if (phase === "confirm") return "Finalizing Global Distribution…";
  return "Initializing…";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();
  const { startUpload, uploads } = useUploads();

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cinema");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [backgroundUpload, setBackgroundUpload] = useState(true);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  // Sync with global state
  const activeUpload = useMemo(() => 
    uploads.find(u => u.id === currentUploadId),
    [uploads, currentUploadId]
  );

  const isBusy = activeUpload?.status === "active";
  const done = activeUpload?.status === "completed";
  const errorMsg = activeUpload?.status === "error" ? activeUpload.error : null;

  // Handle step transitions
  useEffect(() => {
    if (file && step === 0) setStep(1);
    if (isBusy && step < 2) setStep(2);
    if (done && step < 2) setStep(2);
  }, [file, isBusy, done, step]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) {
      toast.push({ variant: "error", title: "Format Error", message: "Please select a valid cinematic video format (MP4, MOV, etc)." });
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
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

  async function onSubmit() {
    if (isBusy || !file || !title.trim()) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.push({ variant: "error", title: "Auth Error", message: "You must be signed in to upload." });
        return;
      }
      const videoId = await startUpload({
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        isPublic: visibility === "public",
        token,
      });

      if (backgroundUpload) {
        toast.push({
          variant: "success",
          title: "Upload Synchronized",
          message: "We're processing your video in the background. You can move freely."
        });
        router.push("/dashboard");
      } else {
        const started = uploads.find(u => u.title === title.trim() && u.status === "active");
        if (started) setCurrentUploadId(started.id);
      }
    } catch (err) {}
  }

  return (
    <div className="min-h-screen py-16 px-6 lg:px-20 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Creator Studio</h1>
          <p className="text-white/40 text-lg font-medium">Publish your cinematic vision to the global audience.</p>
          
          {/* Stepper */}
          <div className="mt-12 flex items-center justify-center gap-4 max-w-lg mx-auto">
             {STEPS.map((s, i) => (
               <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= i ? "bg-primary text-black scale-110 shadow-[0_0_15px_rgba(179,197,255,0.5)]" : "bg-white/5 text-white/20 border border-white/5"
                  }`}>
                    {step > i ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-px transition-colors ${step > i ? "bg-primary" : "bg-white/10"}`} />
                  )}
               </div>
             ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Content Area */}
          <main className="glass-panel rounded-[3rem] p-1 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="p-10 relative z-10">
              {/* STEP 1: SELECT MEDIA */}
              {step === 0 && (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`
                    aspect-[16/9] w-full rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-500 cursor-pointer
                    ${dragging ? "border-primary bg-primary/10 scale-[0.99] shadow-inner" : "border-white/10 bg-white/2 hover:border-primary/40 hover:bg-white/5"}
                  `}
                >
                  <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFileChange} />
                  <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-5xl text-white/20 group-hover:text-primary">upload_file</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white mb-2">Import Master File</h3>
                    <p className="text-white/40 font-medium">Drag and drop your cinematic assets or click to browse</p>
                  </div>
                  <div className="flex gap-4 items-center px-6 py-2 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    <span>MP4</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>MOV</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>HEVC</span>
                  </div>
                </div>
              )}

              {/* STEP 1.5: FILE SELECTED / PREVIEW STATE */}
              {(step === 1 || step === 2) && file && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(179,197,255,0.2)]">
                            <span className="material-symbols-outlined text-3xl">movie</span>
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-white">{file.name}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-0.5">{formatBytes(file.size)} • Ready for Production</p>
                         </div>
                      </div>
                      {!isBusy && !done && (
                        <button onClick={() => {setFile(null); setStep(0);}} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5">
                           <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      )}
                   </div>

                   <div className="grid gap-8">
                      <div>
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 block">Production Title</label>
                        <input 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          placeholder="e.g. Neon Dreams — 4K Cinematic" 
                          disabled={isBusy}
                          className="w-full h-14 rounded-2xl bg-white/5 px-6 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/60 focus:bg-white/10 transition-all" 
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 block">Cinematic Vision (Description)</label>
                        <textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          placeholder="Describe the atmosphere, tech specs, or story..." 
                          rows={5} 
                          disabled={isBusy}
                          className="w-full resize-none rounded-3xl bg-white/5 p-6 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/60 focus:bg-white/10 transition-all" 
                        />
                      </div>
                   </div>
                </div>
              )}
            </div>
          </main>

          {/* Sidebar Area: Settings & Finalize */}
          <aside className="space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
               <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-6">Configuration</h4>
               
               <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em] mb-3 block">Category</label>
                    <div className="grid grid-cols-1 gap-2">
                      {CATEGORIES.slice(0, 4).map((cat) => (
                        <button 
                          key={cat.slug} 
                          onClick={() => setCategory(cat.slug)}
                          disabled={isBusy}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                            category === cat.slug ? "bg-primary text-black border-primary shadow-[0_5px_15px_rgba(179,197,255,0.3)]" : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em] mb-3 block">Visibility</label>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {["public", "private"].map((v) => (
                          <button 
                            key={v} 
                            onClick={() => setVisibility(v as any)} 
                            disabled={isBusy}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              visibility === v ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Background Upload</span>
                    <button
                      onClick={() => setBackgroundUpload(!backgroundUpload)}
                      disabled={isBusy}
                      className={`relative w-10 h-5 rounded-full transition-all ${backgroundUpload ? "bg-primary" : "bg-white/10"}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${backgroundUpload ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
               </div>
            </div>

            {/* Finalize Button */}
            {step === 1 && (
              <button 
                onClick={onSubmit}
                className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Publish Project
              </button>
            )}

            {/* Active Upload Feedback */}
            {step === 2 && activeUpload && (
              <div className="glass-panel p-8 rounded-[2.5rem] border border-primary/30 animate-pulse-slow">
                 <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Live Synchronization</div>
                 <h4 className="text-white font-bold text-sm mb-2">{phaseLabel(activeUpload.phase, activeUpload.progress)}</h4>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 mb-4">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${activeUpload.progress}%` }} />
                 </div>
                 <p className="text-[10px] text-white/30 font-medium leading-relaxed">
                   Your master file is being encrypted and distributed across our cinematic CDN nodes.
                 </p>
              </div>
            )}

            {/* Completion View */}
            {done && (
              <div className="glass-panel p-8 rounded-[2.5rem] border border-green-500/40 text-center">
                 <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-4">
                    <span className="material-symbols-outlined font-black">done_all</span>
                 </div>
                 <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">Publication Ready</h4>
                 <p className="text-[10px] text-white/40 mb-6 font-medium">Your cinematic project has been successfully queued for transcoding.</p>
                 <Link href="/dashboard" className="block w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
                    Go to Studio
                 </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
