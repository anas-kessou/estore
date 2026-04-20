# E-Store Frontend

React + TypeScript + Vite frontend for the E-Store app.

## What this app uses

- Vite + React 18 + TypeScript
- Axios for API calls
- JWT auth with bearer token storage in `localStorage`

## Environment

Create a local env file (already included in this repo):

- `.env`
- `.env.example`

Required variable:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Run locally

```bash
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:5173` by default.

## Build

```bash
pnpm build
```

## API integration notes

- Axios client is configured in `src/core/services/api.ts`
- Every backend response is unwrapped from the Spring `ApiResponse<T>` envelope
- JWT token is attached automatically through an axios request interceptor
- Service modules map backend DTOs to frontend UI types:
  - `auth.service.ts`
  - `catalog.service.ts`
  - `cart.service.ts`
  - `order.service.ts`
  - `review.service.ts`
