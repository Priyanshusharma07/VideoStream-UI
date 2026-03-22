export type UploadVisibility = "public" | "unlisted" | "private";

export type CreatePresignedUploadRequest = {
  filename: string;
  contentType: string;
  size: number;
};

export type CreatePresignedUploadResponse = {
  uploadUrl: string;
  key: string;
  expiresAt: string;
  bucket: string;
  region: string;
};

export type CompleteUploadRequest = {
  key: string;
  originalFilename: string;
  contentType: string;
  size: number;
  title: string;
  description?: string;
  tags?: string[];
  visibility: UploadVisibility;
};

export type CompleteUploadResponse = {
  videoId: string;
  status: "processing";
};

