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

Make sure to map the correct `JAVA_HOME` if your default Java version is < 21 (this project uses Java 21):

```bash
cd estore-backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
mvn clean spring-boot:run
```

Backend API: `http://localhost:8080/api`

## 2) Run frontend

If `pnpm` isn't installed globally, use `npx`:

```bash
cd estore-frontend
npx --yes pnpm install
npx --yes pnpm run dev
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
