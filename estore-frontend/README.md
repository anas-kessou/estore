# E-Store Frontend

React + TypeScript + Vite frontend for the E-Store app.

## What this app uses

- Vite + React 18 + TypeScript
- `@vitejs/plugin-react-swc` (faster dev server, avoids Babel runtime issues)
- Tailwind CSS (utility-first styling)
- React Router DOM (client-side routing)
- TanStack Query (server-state, caching, mutations)
- Zustand (client/local state)
- Radix UI primitives (headless accessible components)
- Framer Motion (animations)
- Lucide React (icons)
- Sonner (toasts/notifications)
- Axios for API calls
- JWT auth with bearer token storage in `localStorage`

## Architecture overview (how the frontend is organized)

This frontend is a **feature-oriented React app** (pages grouped by domain) with a small “core” layer for cross-cutting concerns.

### Entry point and composition

- `src/main.tsx`: mounts the app, wraps it with:
  - `ErrorBoundary` (`src/components/ErrorBoundary.tsx`)
  - `QueryClientProvider` (TanStack Query)
- `src/App.tsx`: defines routes + shared layout (`Navbar`, `Footer`)

### Routing

- **Router**: React Router DOM, configured in `src/App.tsx`
- **Public routes**: `/`, `/products`, `/products/:id`, `/login`, `/register`
- **Protected routes**: `/cart`, `/orders`, `/profile`
  - Guarded by `src/core/guards/ProtectedRoute.tsx` (checks `AuthService.isAuthenticated()`)

### State management strategy

- **Server state (API data)**: TanStack Query via `useQuery` / `useMutation`
  - Example usage: `src/features/catalog/pages/ProductDetailPage.tsx`
- **Client/local state**: Zustand stores
  - Example store: `src/core/stores/useCartStore.ts`
  - Note: there is also a feature-scoped cart store under `src/features/cart/store/`

### API + services layer

- **Axios client + endpoints**: `src/core/services/api.ts`
  - `VITE_API_BASE_URL` is normalized (trailing slash removed) and falls back to `http://localhost:8080/api`
  - Request interceptor injects `Authorization: Bearer <token>` when present
  - `unwrapResponse<T>()` unwraps the backend envelope: `{ success, message, data, timestamp }`
- **Domain services**: `src/core/services/*.service.ts`
  - `AuthService`, `CatalogService`, `CartService`, `OrderService`, `ReviewService`
  - Re-exported via `src/core/services/index.ts`

### Authentication

- **Token storage key**: `auth_token` in `localStorage`
- **Current user cache**: `current_user` in `localStorage` (JSON)
- **Auth change notification**: `AuthService` dispatches a window event `auth-changed` (`AUTH_CHANGED_EVENT`)

### Types and shared UI

- **Shared types**: `src/shared/types/index.ts` (User, Product, Cart, Order, Review, etc.)
- **Shared layout/components**: `src/shared/components/*` (e.g. `Navbar`, `Footer`, `ProductCard`)

### Styling and UI

- **Tailwind**: base styles are wired in `src/index.css` (`@tailwind base/components/utilities`)
- **Component styling approach**: mostly Tailwind utility classes in JSX, with a small amount of CSS in `src/App.css` / `src/index.css`
- **UI primitives**: Radix UI packages in dependencies (used where needed for accessible primitives)

## Project layout

```text
src/
  App.tsx                     # routes + layout
  main.tsx                    # app bootstrap (ErrorBoundary + QueryClientProvider)
  components/                 # app-wide components (e.g. ErrorBoundary)
  core/
    guards/                   # route guards (ProtectedRoute)
    services/                 # API client + domain services (axios)
    stores/                   # global Zustand stores
  features/                   # domain modules (auth, catalog, cart, orders, profile)
    <feature>/pages/          # routed pages
    <feature>/store/          # feature-scoped stores (where applicable)
  shared/
    components/               # shared UI (Navbar, Footer, ProductCard)
    types/                    # shared TS domain types
  hooks/                      # reusable hooks
  lib/                        # shared utilities (if/when present)
```

## Environment

Create a local env file:

- `.env.example`

Required variable:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Run locally

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default (it will auto-pick `5174` if `5173` is busy).

## Build

```bash
npm run build
```

## Lint and typecheck

```bash
npm run lint
npm run build
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

## Quick start (with backend)

1) Start the backend (Spring Boot) on port `8080`.

2) Create your env file:

```bash
cp .env.example .env
```

3) Start the frontend:

```bash
npm run dev
```
