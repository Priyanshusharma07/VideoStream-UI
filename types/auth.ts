export type { ApiError, ApiResult } from "./api";

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
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

export type SignupResponse = LoginResponse;
