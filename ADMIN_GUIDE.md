# E-Store Administrator Guide

This guide explains how to manage your store's catalog (Categories and Products) via the Admin Dashboard.

## 1. Accessing the Admin Dashboard

1. **Login**: Go to the login page and use your administrative credentials.
   - **Default Admin**: `admin@example.com` / `admin123`
2. **Navigation**: Click on the **Admin** link in the navigation bar to go to the **Catalog Management** page.

---

## 2. Managing Categories

Categories are used to group your products. We recommend setting up your categories before adding products.

### Creating a Category
1. Go to the **Categories** tab.
2. Click **Add New Category**.
3. Fill in the **Name**, **Description**, and an **Image URL** (from Unsplash or similar).
4. Ensure **Category is Active** is checked.
5. Click **Create Category**.

### Editing/Deleting Categories
- Use the **Edit (Pencil)** icon to update details.
- Use the **Trash** icon to remove a category. *Note: Ensure no products are linked before deleting.*

---

## 3. Managing Products

### Adding a Product
1. Go to the **Products** tab.
2. Click **Add New Product**.
3. **Internal ID**: Give the product a unique stable ID (e.g., `FW-2026-001`).
4. **Category**: Select the relevant category from the dropdown.
5. **Details**: Enter Name, Price, and Description.
6. **Inventory**: Enter the **Initial Stock** amount. This will automatically sync with the Inventory service.
7. Click **Create Product**.

### Product Statuses
- **Active**: Visible to customers in the storefront.
- **Featured**: Highlighted on the animated home page "Trending" section.
- **Out of Stock**: If stock hits 0, customers will see "Sold Out" and cannot add to cart.

---

## 4. Bulk Operations

If you have many products, use the **Bulk Import** tab.
- Upload a **CSV file** with the required columns.
- The system will use the unique ID to **create new** or **update existing** entries.
- This also synchronizes stock quantities and creates inventory records.

---

## 5. Technical Note: Data Synchronization

- **MySQL**: Stores your core catalog (Categories, Products, Orders).
- **MongoDB**: Stores customer Reviews.
- **System Integrity**: When you delete a product via the Admin UI, the system automatically removes all associated reviews from MongoDB to keep the database clean.

---

## 6. Pro Tips for Aesthetics
- **Images**: Use high-quality JPG/PNG URLs. For testing, you can use `https://images.unsplash.com/photo-XXX?auto=format&fit=crop&q=80&w=800`.
- **Display Order**: The home page animations work best with a diverse set of categories and featured products.
