# E-Store Full Stack

Monorepo containing:

- `estore-backend` (Spring Boot, MySQL, MongoDB, JWT)
- `estore-frontend` (React + Vite + Axios)

## Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8+
- MongoDB 6+
- Node.js 20+
- pnpm 8+

## 1) Run backend

```bash
cd estore-backend
mvn clean spring-boot:run
```

Backend API: `http://localhost:8080/api`

## 2) Run frontend

```bash
cd estore-frontend
pnpm install
pnpm dev
```

Frontend URL: `http://localhost:5173`

## Frontend ↔ Backend link

- Frontend uses axios in `estore-frontend/src/core/services/api.ts`
- Base URL comes from `VITE_API_BASE_URL` in `estore-frontend/.env`
- Backend CORS allows `http://localhost:5173`
- Backend response envelope `ApiResponse<T>` is unwrapped in frontend service helpers

## Quick login

- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `admin@example.com` / `admin123`
