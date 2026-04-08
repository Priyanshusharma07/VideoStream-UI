import type {
  ApiResult,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/auth";
import { postApi } from "@/services/api-client";

function normalizeLoginResponse(value: LoginResponse): LoginResponse {
  if (value.accessToken) return value;
  if (value.access_token) return { ...value, accessToken: value.access_token };
  return value;
}

export async function login(
  input: LoginRequest,
): Promise<ApiResult<LoginResponse>> {
  const result = await postApi<LoginRequest, LoginResponse>("/auth/login", input);
  if (!result.ok) return result;
  return { ok: true, data: normalizeLoginResponse(result.data) };
}

export async function forgotPassword(
  input: ForgotPasswordRequest,
): Promise<ApiResult<ForgotPasswordResponse>> {
  return postApi<ForgotPasswordRequest, ForgotPasswordResponse>(
    "/auth/forgot-password",
    input,
  );
}

export async function signup(
  input: SignupRequest,
): Promise<ApiResult<SignupResponse>> {
  const result = await postApi<SignupRequest, SignupResponse>("/auth/register", input);
  if (!result.ok) return result;
  return { ok: true, data: normalizeLoginResponse(result.data) };
}
