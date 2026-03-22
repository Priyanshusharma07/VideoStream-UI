export type ApiError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
