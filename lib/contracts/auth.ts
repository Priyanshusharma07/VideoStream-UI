export type ApiError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type ForgotPasswordResponse = {
  status: "ok";
};

