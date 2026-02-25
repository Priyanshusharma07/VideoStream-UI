import type {
  ApiResult,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "./contracts/auth";

async function postApi<Req, Res>(
  path: string,
  input: Req,
): Promise<ApiResult<Res>> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => null)) as unknown;
  if (json && typeof json === "object" && "ok" in json) {
    return json as ApiResult<Res>;
  }

  return {
    ok: false,
    error: { code: "bad_response", message: "Unexpected response from server." },
  };
}

export async function login(
  input: LoginRequest,
): Promise<ApiResult<LoginResponse>> {
  return postApi<LoginRequest, LoginResponse>("/api/auth/login", input);
}

export async function forgotPassword(
  input: ForgotPasswordRequest,
): Promise<ApiResult<ForgotPasswordResponse>> {
  return postApi<ForgotPasswordRequest, ForgotPasswordResponse>(
    "/api/auth/forgot-password",
    input,
  );
}

export async function signup(
  input: SignupRequest,
): Promise<ApiResult<SignupResponse>> {
  return postApi<SignupRequest, SignupResponse>("/api/auth/signup", input);
}
