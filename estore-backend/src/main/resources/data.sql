-- Categories
INSERT INTO categories (id, name, description, active) VALUES (1, 'Electronics', 'Laptops, Phones and Gadgets', true) ON DUPLICATE KEY UPDATE name='Electronics';
INSERT INTO categories (id, name, description, active) VALUES (2, 'Apparel', 'Clothing and Accessories', true) ON DUPLICATE KEY UPDATE name='Apparel';

-- Products
INSERT INTO products (id, name, price, description, image_url, category_id, active, featured) 
VALUES (101, 'MacBook Pro M3', 1999.99, 'Latest Apple MacBook Pro 16GB RAM', 'https://via.placeholder.com/400x300?text=MacBook', 1, true, true) ON DUPLICATE KEY UPDATE name='MacBook Pro M3';
INSERT INTO products (id, name, price, description, image_url, category_id, active, featured) 
VALUES (102, 'Minimalist T-Shirt', 25.00, '100% organic cotton', 'https://via.placeholder.com/400x300?text=TShirt', 2, true, false) ON DUPLICATE KEY UPDATE name='Minimalist T-Shirt';

-- Inventory (1-to-1 with Product)
INSERT INTO inventory (id, quantity, product_id) VALUES (1, 15, 101) ON DUPLICATE KEY UPDATE quantity=15;
INSERT INTO inventory (id, quantity, product_id) VALUES (2, 100, 102) ON DUPLICATE KEY UPDATE quantity=100;

-- Users (BCrypt encoded password: 'password123')
INSERT INTO users (id, email, password, first_name, last_name, role, enabled) 
VALUES (1, 'john@example.com', '$2y$10$f3Y47UAn9iR.XW0G6Y3kkuK.k/Uv39R4B7lZ.uR.q8v.N/05R.9t2', 'John', 'Doe', 'ROLE_CUSTOMER', true) ON DUPLICATE KEY UPDATE email='john@example.com';

-- Profiles (1-to-1 with User)
INSERT INTO profiles (id, phone, address, city, country, user_id)
VALUES (1, '+212600000000', '123 Main St', 'Casablanca', 'Morocco', 1) ON DUPLICATE KEY UPDATE phone='+212600000000';