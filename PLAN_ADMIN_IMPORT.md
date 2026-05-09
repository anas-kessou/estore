# Plan: Admin products page (CSV + manual add/update + delete) with MySQL↔Mongo sync by productId

## Information Gathered

- Frontend current route exists:
  - `estore-frontend/src/App.tsx`: `/admin/import/products` → `ImportProductsPageAdmin` → `ImportProductsPage`.
- Current frontend admin page supports only CSV upload:
  - `estore-frontend/src/features/admin/pages/ImportProductsPage.tsx`
  - uses `AdminService.importProductsCsv(file)`.
- Current frontend admin service supports only CSV upload:
  - `estore-frontend/src/core/services/admin.service.ts`
  - calls `POST /api/admin/import/products-csv`.
- Backend admin CSV endpoint exists:
  - `estore-backend/src/main/java/com/estore/catalog/admin/AdminProductImportController.java`
    - `POST /api/admin/import/products-csv` (multipart/form-data, part name `file`)
- Backend CSV import logic creates/updates MySQL products by `externalId`:
  - `ProductsCsvImportService` uses `productRepository.findByExternalId(externalId)` and updates `Product` fields.
- Product stored in MySQL:
  - `Product` is a JPA entity (`@Entity @Table(name="products")`).
- Reviews stored in MongoDB and linked by `productId` value:
  - `Review` document has `productId: Long` and repositories query by it.
  - `CatalogService.toProductDTO` calls `reviewRepository.averageRatingByProductId(product.getId())`.
- Review create API expects `productId` (and rating/comment) from frontend:
  - `POST /api/reviews` uses `productId` in request body.
- No backend admin endpoint exists yet for add single product or delete product.

## Plan

### Backend changes (MySQL + Mongo cleanup)

1. Extend `AdminProductImportController` with new endpoints (admin-only):
   - `POST /api/admin/import/product`
     - consumes JSON
     - accepts payload with fields needed to create/update a product:
       - `externalId` (required, unique)
       - `name` (required)
       - `brandDesc`/`description` (map to `Product.description`)
       - `sellPrice` / `price` (required)
       - `categoryName` (required) (create category if missing, same as CSV import)
       - optional: `imageUrl` / `imageUrls` / `active` / `featured` / `stockQuantity`
     - implementation can reuse logic from `ProductsCsvImportService` for category lookup + defaults.
     - return `{ productId: number }`.

   - `DELETE /api/admin/import/product/{externalId}`
     - by `externalId` for admin convenience
     - implementation:
       - find product by `externalId` in MySQL
       - delete its reviews from MongoDB by `productId`
         - requires adding a delete method in `ReviewRepository` (e.g. `deleteByProductId(Long productId)`)
       - delete the product from MySQL
       - return success.

2. Add a small DTO classes for request/response:
   - e.g. `AdminUpsertProductRequest` and `AdminUpsertProductResponse`.

3. Implement business method in a service:
   - either extend `ProductsCsvImportService` or create `AdminProductService`.

### Frontend changes

1. Update `estore-frontend/src/core/services/api.ts`
   - add endpoints for:
     - `POST /api/admin/import/product`
     - `DELETE /api/admin/import/product/{externalId}`

2. Update `estore-frontend/src/core/services/admin.service.ts`
   - add methods:
     - `upsertProduct(payload)`
     - `deleteProductByExternalId(externalId)`

3. Update `estore-frontend/src/features/admin/pages/ImportProductsPage.tsx`
   - Convert page into a single page with two sections:
     - Section A: existing CSV upload (keep as-is)
     - Section B: manual product form:
       - inputs: externalId, productName, brandDesc/description, sellPrice, category
       - button: Add/Update
       - show created/updated result and returned productId
     - Section C: delete form:
       - input: externalId (or productId)
       - button: Delete
       - confirmation dialog
       - show result

4. Ensure “synchronization” behavior by `productId`
   - Upsert uses same productId stored in MySQL.
   - Reviews already use productId. After upsert, product detail will show correct description and review stats.
   - Delete cleans up Mongo reviews by productId (this is your selected option B).

## Dependent Files to be edited

- Backend:
  - `estore-backend/src/main/java/com/estore/catalog/admin/AdminProductImportController.java`
  - `estore-backend/src/main/java/com/estore/catalog/admin/service/ProductsCsvImportService.java` (or new service)
  - `estore-backend/src/main/java/com/estore/reviews/repository/ReviewRepository.java`
  - (new) admin DTO request/response classes

- Frontend:
  - `estore-frontend/src/core/services/api.ts`
  - `estore-frontend/src/core/services/admin.service.ts`
  - `estore-frontend/src/features/admin/pages/ImportProductsPage.tsx`

## Followup Steps

- Build + run backend/frontend with docker-compose.
- Test:
  - CSV import still works.
  - Manual add/update creates product in MySQL.
  - Product detail page shows reviews and uses updated description.
  - Delete removes both MySQL product and Mongo reviews.
