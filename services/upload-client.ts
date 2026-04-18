import type { ApiResult } from "@/types/api";
import { postApi } from "@/services/api-client";
import type {
  CompleteUploadRequest,
  CompleteUploadResponse,
  CreatePresignedUploadRequest,
  CreatePresignedUploadResponse,
} from "@/types/upload";

const PRESIGN_PATH =
  process.env.NEXT_PUBLIC_UPLOAD_PRESIGN_PATH ?? "/uploads/presign";
const COMPLETE_PATH =
  process.env.NEXT_PUBLIC_UPLOAD_COMPLETE_PATH ?? "/uploads/complete";

export async function createPresignedUpload(
  input: CreatePresignedUploadRequest,
): Promise<ApiResult<CreatePresignedUploadResponse>> {
  return postApi<CreatePresignedUploadRequest, CreatePresignedUploadResponse>(
    PRESIGN_PATH,
    input,
  );
}

export async function completeUpload(
  input: CompleteUploadRequest,
): Promise<ApiResult<CompleteUploadResponse>> {
  return postApi<CompleteUploadRequest, CompleteUploadResponse>(
    COMPLETE_PATH,
    input,
  );
}


