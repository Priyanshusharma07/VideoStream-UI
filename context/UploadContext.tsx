"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { uploadVideo } from "@/services/video.service";
import { useToast } from "@/components/ui/ToastProvider";

export type UploadStatus = {
  id: string;
  title: string;
  progress: number;
  phase: "presign" | "upload" | "confirm";
  status: "active" | "completed" | "error";
  error?: string;
  videoId?: number;
};

type UploadContextValue = {
  uploads: UploadStatus[];
  startUpload: (params: {
    file: File;
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
    token?: string | null;
  }) => Promise<number>;
  clearUpload: (id: string) => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const toast = useToast();

  const updateUpload = useCallback((id: string, update: Partial<UploadStatus>) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...update } : u))
    );
  }, []);

  const clearUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const startUpload = useCallback(
    async (params: {
      file: File;
      title: string;
      description?: string;
      category?: string;
      tags?: string[];
      isPublic?: boolean;
      token?: string | null;
    }) => {
      const id = crypto.randomUUID();
      
      const newUpload: UploadStatus = {
        id,
        title: params.title,
        progress: 0,
        phase: "presign",
        status: "active",
      };

      setUploads((prev) => [...prev, newUpload]);

      try {
        const result = await uploadVideo({
          ...params,
          onProgress: (phase, progress) => {
            updateUpload(id, { phase, progress });
          },
        });

        updateUpload(id, { status: "completed", progress: 100, videoId: result.videoId });
        toast.push({
          variant: "success",
          title: "Upload Complete",
          message: `"${params.title}" has been published successfully.`,
        });
        
        return result.videoId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        updateUpload(id, { status: "error", error: message });
        toast.push({
          variant: "error",
          title: "Upload Failed",
          message: `Could not upload "${params.title}": ${message}`,
        });
        throw err;
      }
    },
    [updateUpload, toast]
  );

  const value = useMemo(
    () => ({ uploads, startUpload, clearUpload }),
    [uploads, startUpload, clearUpload]
  );

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploads() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUploads must be used within UploadProvider");
  return ctx;
}
