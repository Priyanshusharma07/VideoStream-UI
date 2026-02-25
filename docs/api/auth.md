# Auth API (Demo Contract)

These endpoints are **mocked inside the Next.js app** so frontend can be built before the real backend is ready.

Base URL (local): `http://localhost:3000`

## Common response shape

All endpoints return:

```json
{ "ok": true, "data": {} }
```

or

```json
{
  "ok": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid request body.",
    "fieldErrors": { "email": "Enter a valid email." }
  }
}
```

## POST `/api/auth/login`

### Request body

```json
{
  "email": "demo@streamhub.com",
  "password": "demo1234",
  "remember": true
}
```

### Success `200`

```json
{
  "ok": true,
  "data": {
    "accessToken": "demo-access-...",
    "refreshToken": "demo-refresh-...",
    "expiresAt": "2026-02-21T12:34:56.789Z",
    "user": {
      "id": "uuid",
      "email": "demo@streamhub.com",
      "name": "Demo User"
    }
  }
}
```

### Errors

- `400` `validation_error` (missing/invalid fields)
- `401` `invalid_credentials` (email/password mismatch)

### Demo credentials

- Email: `demo@streamhub.com`
- Password: `demo1234`

## POST `/api/auth/signup`

### Request body

```json
{
  "name": "Alex Doe",
  "email": "alex@example.com",
  "password": "secret123"
}
```

### Success `200`

Same shape as login success:

```json
{
  "ok": true,
  "data": {
    "accessToken": "demo-access-...",
    "refreshToken": "demo-refresh-...",
    "expiresAt": "2026-02-21T12:34:56.789Z",
    "user": {
      "id": "uuid",
      "email": "alex@example.com",
      "name": "Alex Doe"
    }
  }
}
```

### Errors

- `400` `validation_error` (missing/invalid fields)
- `409` `email_taken` (email already exists; demo uses `demo@streamhub.com`)

## POST `/api/auth/forgot-password`

### Request body

```json
{ "email": "demo@streamhub.com" }
```

### Success `200`

```json
{ "ok": true, "data": { "status": "ok" } }
```

### Errors

- `400` `validation_error`
