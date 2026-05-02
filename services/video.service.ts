import { getAccessToken } from '@/lib/auth-session';


const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/+$/, '');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inferVideoExt(file: File): 'mp4' | 'webm' | 'mov' | null {
  const ext = file.name.split('.').pop()?.trim().toLowerCase() ?? '';
  if (ext === 'mp4' || ext === 'webm' || ext === 'mov') return ext;

  const type = file.type.trim().toLowerCase();
  if (type === 'video/mp4') return 'mp4';
  if (type === 'video/webm') return 'webm';
  if (type === 'video/quicktime') return 'mov';

  return null;
}

/**
 * Returns the exact MIME type the backend uses when signing the presigned URL.
 * The backend always uses `video/${videoExt}` — we must echo this exactly on
 * the S3 PUT request, or S3's signature verification will fail.
 */
function signedMimeType(videoExt: 'mp4' | 'webm' | 'mov'): string {
  return `video/${videoExt}`;
}

function requireToken(token?: string | null): string {
  const t = token ?? getAccessToken();
  if (!t) throw new Error('Not authenticated. Please sign in to upload.');
  return t;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadUrlResponse {
  videoId: string;
  videoUploadUrl: string;
  thumbnailUploadUrl: string | null;
  videoKey: string;
  thumbnailKey: string | null;
  /** The exact Content-Type that was embedded in the presigned URL signature. */
  signedContentType: string;
}

export interface CreateVideoResponse {
  videoId: number;
  status: 'processing' | 'ready';
}

export interface UploadVideoOptions {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  token?: string | null;
  onProgress?: (phase: 'presign' | 'upload' | 'confirm', percent: number) => void;
  signal?: AbortSignal;
}

// ─── STEP 1: Get presigned upload URL ────────────────────────────────────────

/**
 * Calls POST /videos/upload-url to obtain S3 presigned upload URLs.
 *
 * Backend DTO (CreateUploadUrlsDto) expects:
 *   { videoExt: 'mp4' | 'webm' | 'mov', contentType: string, thumbnailExt?: string }
 */
export async function getUploadUrl(
  file: File,
  token?: string | null,
): Promise<UploadUrlResponse> {
  const authToken = requireToken(token);

  const videoExt = inferVideoExt(file);
  if (!videoExt) {
    throw new Error(
      `Unsupported video format "${file.name}". Please upload an mp4, webm, or mov file.`,
    );
  }

  // The backend signs the presigned URL with `video/${videoExt}` — we derive
  // the exact MIME here so we can match it on the S3 PUT (must be identical).
  const contentType = signedMimeType(videoExt);

  const res = await fetch(`${API_BASE}/videos/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ videoExt, contentType }),
  });

  if (!res.ok) {
    let message = `Failed to get upload URL (HTTP ${res.status})`;
    try {
      const json = (await res.json()) as Record<string, unknown>;
      if (typeof json.message === 'string') message = json.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = (await res.json()) as Omit<UploadUrlResponse, 'signedContentType'>;
  // Attach the MIME we sent so uploadToS3 can echo it exactly on the PUT.
  return { ...data, signedContentType: contentType };
}

// ─── STEP 2: Upload file directly to S3 via presigned PUT ─────────────────────

async function uploadToS3(
  presignedUrl: string,
  file: File,
  options?: {
    /** Must be the EXACT Content-Type the presigned URL was signed with. */
    contentType: string;
    onProgress?: (percent: number) => void;
    signal?: AbortSignal;
  },
): Promise<void> {
  // The Content-Type on the PUT MUST exactly match what the backend embedded
  // in the presigned URL signature. Sending `file.type` (e.g. "video/quicktime"
  // for .mov) when the URL was signed with "video/mov" will cause S3 to reject
  // the signature, which manifests as a CORS/network error in the browser.
  const contentType = options?.contentType ?? file.type;

  if (options?.onProgress) {
    // Use XMLHttpRequest for upload-progress events (fetch doesn't support them).
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);
      // Set the exact signed Content-Type — not file.type.
      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          options.onProgress!(Math.round((e.loaded * 100) / e.total));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          options.onProgress!(100);
          resolve();
        } else {
          // xhr.responseText may contain S3's XML error — helpful for debugging.
          reject(
            new Error(
              `S3 upload failed (HTTP ${xhr.status})${xhr.responseText ? ': ' + xhr.responseText.slice(0, 200) : ''}`,
            ),
          );
        }
      };

      xhr.onerror = () =>
        reject(
          new Error(
            'S3 upload failed (network error). This is usually a CORS misconfiguration on the S3 bucket — check that PUT and Content-Type are allowed from your origin.',
          ),
        );
      xhr.ontimeout = () => reject(new Error('S3 upload timed out'));

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new DOMException('Upload aborted', 'AbortError'));
        });
      }

      xhr.send(file);
    });
  } else {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      signal: options?.signal,
      // Must match the signed Content-Type exactly.
      headers: { 'Content-Type': contentType },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `Failed to upload video to S3 (HTTP ${res.status})${body ? ': ' + body.slice(0, 200) : ''}`,
      );
    }
  }
}

// ─── STEP 3: Confirm upload — create video record ─────────────────────────────

/**
 * Calls POST /videos to create the video DB record.
 *
 * Backend DTO (CreateVideoDto) expects:
 *   { title, fileKey, description?, tags?, isPublic? }
 */
export async function confirmUpload(
  params: {
    title: string;
    fileKey: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  },
  token?: string | null,
): Promise<CreateVideoResponse> {
  const authToken = requireToken(token);

  const body: Record<string, unknown> = {
    title: params.title,
    fileKey: params.fileKey,
  };
  if (params.description) body.description = params.description;
  if (params.tags && params.tags.length > 0) body.tags = params.tags;
  if (typeof params.isPublic === 'boolean') body.isPublic = params.isPublic;

  const res = await fetch(`${API_BASE}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Failed to confirm upload (HTTP ${res.status})`;
    try {
      const json = (await res.json()) as Record<string, unknown>;
      if (typeof json.message === 'string') message = json.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<CreateVideoResponse>;
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

/**
 * Full 3-step S3 presigned URL upload flow:
 *   1. POST /videos/upload-url  → get presigned URLs + keys
 *   2. PUT <videoUploadUrl>     → stream file directly to S3
 *   3. POST /videos             → confirm upload, create DB record
 */
export async function uploadVideo(options: UploadVideoOptions): Promise<CreateVideoResponse> {
  const { file, title, description, tags, isPublic = true, signal } = options;
  const token = requireToken(options.token);

  // Phase 1 — get presigned URL
  options.onProgress?.('presign', 0);
  const urlData = await getUploadUrl(file, token);
  options.onProgress?.('presign', 100);

  // Phase 2 — upload to S3
  // Pass the exact signed Content-Type so S3's signature check passes.
  options.onProgress?.('upload', 0);
  await uploadToS3(urlData.videoUploadUrl, file, {
    contentType: urlData.signedContentType,
    onProgress: (pct) => options.onProgress?.('upload', pct),
    signal,
  });
  options.onProgress?.('upload', 100);

  // Phase 3 — confirm
  options.onProgress?.('confirm', 0);
  const result = await confirmUpload(
    {
      title,
      fileKey: urlData.videoKey,
      description,
      tags,
      isPublic,
    },
    token,
  );
  options.onProgress?.('confirm', 100);

  return result;
}

// services/videoService.ts

export async function getVideos(token?: string | null) {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await res.json();

  // 🔥 Transform data for UI
  return data.videos
    .filter((v: any) => v.status === 'ready') // only playable videos
    .map((v: any) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      tags: v.tags,
      views: v.views,
      duration: v.duration,
      createdAt: v.createdAt,

      // ✅ FIX: build full URLs
      thumbnailUrl: v.thumbnailPath
        ? `${API_BASE}/videos/thumbnail?key=${encodeURIComponent(v.thumbnailPath)}`
        : '/placeholder.jpg',

      videoUrl: v.s3HlsKey
        ? `${API_BASE}/videos/play?key=${encodeURIComponent(v.s3HlsKey)}`
        : null,
    }));
}