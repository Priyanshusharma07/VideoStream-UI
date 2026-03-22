import type {
  ApiResult,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "./contracts/auth";
import { postApi } from "./api-client";

export async function login(
  input: LoginRequest,
): Promise<ApiResult<LoginResponse>> {
  return postApi<LoginRequest, LoginResponse>("/auth/login", input);
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
  return postApi<SignupRequest, SignupResponse>("/auth/register", input);
}
