import type { ApiResult, LoginRequest, LoginResponse } from "./contracts/auth";

export async function login(
  input: LoginRequest,
): Promise<ApiResult<LoginResponse>> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => null)) as unknown;
  if (json && typeof json === "object" && "ok" in json) {
    return json as ApiResult<LoginResponse>;
  }

  return {
    ok: false,
    error: { code: "bad_response", message: "Unexpected response from server." },
  };
}

