# Postman collection - E-Store Backend

## Import

1. Open **Postman**
2. **Import** → choose `estore-backend.postman_collection.json`

## Configure

- Set `baseUrl` (defaults to `http://localhost:8080`)
- Ensure backend is running

## JWT flow

1. Run **Auth → Login (USER) - set {{token}}**
2. The request stores the JWT into the collection variable `token`
3. Use the rest of the requests (they use `Authorization: Bearer {{token}}`)

## Admin flow

- Run **Auth → Login (ADMIN) - set {{token}}** to call:
  - `PUT /api/orders/{orderId}/status` (ADMIN)
  - `POST /api/admin/import/products-csv` (ADMIN)

## Notes / gotchas

- `PUT /api/orders/{orderId}/status` expects the order status as a **query parameter**: `?status=PENDING` (etc.).
- `POST /api/admin/import/products-csv` expects multipart form-data with part name **file**.
