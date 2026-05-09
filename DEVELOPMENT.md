# Development (Docker Compose)

## Start the stack

```bash
docker compose up --build
```

## Default service URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
  - Products: http://localhost:8080/api/products

## Reset volumes (wipe Mongo + MySQL data)

```bash
docker compose down -v
docker compose up --build
```

## Useful notes

- Admin seed user (from `DataInitializer`):
  - `admin@example.com / admin123`
