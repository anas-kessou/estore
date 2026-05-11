# 🛍️ E-Store Full Stack E-Commerce Platform

E-Store is a comprehensive, production-ready e-commerce solution designed to provide a premium shopping experience. It features a robust **Spring Boot** backend handling transactional integrity and a blazing-fast **React + Vite** frontend with a modern, glassmorphic UI.

---

## 📖 Overview
E-Store uses a **Polyglot Persistence** architecture:
- **MySQL**: Handles "Highly Consistent" data—Users, Orders, Inventory, and Products.
- **MongoDB**: Handles "Highly Scalable" document data—Product Reviews and Ratings.

This project demonstrates modern full-stack development practices, including JWT authentication, role-based access control, automated stock management, and fluid animations.

![UI Preview](https://via.placeholder.com/1000x400?text=E-Store+Full+Stack+Experience)

---

## ✨ Key Features
- **Premium UI**: Modern aesthetic using Tailwind CSS, Framer Motion, and Radix UI.
- **Performance**: Instant page transitions and reactive state updates.
- **Dual Database**: Best-of-both-worlds approach using MySQL and MongoDB.
- **Secure Auth**: Stateless JWT authentication with secure route guarding.
- **Catalog Management**: Advanced search, category filtering, and product details.
- **Shopping System**: Fully functional cart with persistent storage and checkout flow.
- **Admin Tools**: Statistics, product management, and stock control.

---

## 🛠️ Technology Stack

### 🎨 Frontend (`/estore-frontend`)
- **Framework**: React 18 & Vite (TypeScript)
- **State Management**: 
  - **Server state**: TanStack Query (Caching, Mutations)
  - **Local state**: Zustand
- **Styling**: Tailwind CSS & Framer Motion (Animations)
- **UI Components**: Radix UI (Primitives) & Lucide React (Icons)
- **Networking**: Axios (with Interceptors for JWT injection)
- **Routing**: React Router DOM (v6) with Protected Route guards

### ⚙️ Backend (`/estore-backend`)
- **Core Framework**: Spring Boot 3.2.x (Java 17)
- **Persistence**: 
  - **Spring Data JPA** (MySQL 8.x)
  - **Spring Data MongoDB** (MongoDB 6.x)
- **Security**: Spring Security + JWT Token Provider
- **Logic**: Domain-Driven Design (DDD) approach across Catalog, Inventory, Billing, and Reviews.
- **Build Tool**: Maven

---

## 🚦 Getting Started

### Prerequisites
- **Java 21** & **Maven 3.6+**
- **Node.js 20+** & **npm**
- **MySQL 8.0+** & **MongoDB 6.0+** (Running locally OR via Docker)

### 1. Database Setup
```sql
-- MySQL: Create the database
CREATE DATABASE estore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
```bash
# MongoDB: Initialize the reviews collection
mongosh --eval "use estore_reviews"
```

### 2. Manual Installation

#### Run Backend
```bash
cd estore-backend
# Update application.yml with your credentials
mvn clean spring-boot:run
```

#### Run Frontend
```bash
cd estore-frontend
npm install
npm run dev
```

### 3. Docker Installation (Recommended)
The root directory includes a `docker-compose.yml` that orchestrates the environment:
```bash
docker-compose up --build
```
> *Note: Ensure your MongoDB is either included in the docker-compose or accessible from the container.*

---

## 🔌 API Documentation

### Major Endpoints Summary
| Module | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/auth/login` | Returns JWT token |
| **Catalog** | `GET /api/products` | Lists products (paginated) |
| **Inventory** | `GET /api/inventory/{id}` | Real-time stock check |
| **Cart** | `GET /api/cart/{userId}` | Get user's active cart |
| **Orders** | `POST /api/orders` | Processes checkout |
| **Reviews** | `GET /api/reviews/product/{id}` | Fetches MongoDB stored reviews |

---

## 🏗️ Architecture & Project Structure

### Backend Layout
```text
estore-backend/src/main/java/com/estore/
├── billing/     # Order & Checkout logic
├── catalog/     # Products & Category entities
├── customer/    # User management & Auth
├── inventory/   # Stock tracking
├── reviews/     # MongoDB review system
└── security/    # JWT & Spring Security config
```

### Frontend Layout
```text
estore-frontend/src/
├── core/        # API Services, Auth guards, & Zustand stores
├── features/    # Module-based pages (catalog, auth, cart, etc.)
├── shared/      # Reusable UI components (Navbar, Sidebar)
└── hooks/       # Custom React hooks
```

---

## 🔑 Test Credentials
The database is pre-seeded with the following users:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **Customer** | `john@example.com` | `password123` |
| **Customer** | `jane@example.com` | `password123` |

---

## 📜 License
This project is licensed under the MIT License.
