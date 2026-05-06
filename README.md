# 🛍️ E-Store Full Stack E-Commerce Platform

## 📖 Description
E-Store is a comprehensive, dual-database e-commerce solution designed to provide a seamless shopping experience. It allows users to browse products, manage their shopping carts, place orders, and leave reviews. The backend is powered by Spring Boot (Java 21) handling robust business logic and secure JWT authentication, while the frontend is a blazing-fast React + Vite application featuring a modern, highly responsive UI.

This monorepo contains both the **Spring Boot Backend** and the **React + Vite Frontend**.

![UI Preview](https://via.placeholder.com/1000x400?text=E-Store+Modern+UI)

## ✨ Key Features

- **Modern Responsive UI**: Premium aesthetic with Glassmorphism, Tailwind CSS, Plus Jakarta Sans, and fluid animations.
- **State Management**: Robust client-side state using **Zustand** and server-state synchronization with **TanStack Query**.
- **Secure Authentication**: Stateless JWT-based authentication with role-based access control.
- **Catalog & Inventory**: Browse categories, search products, check real-time stock limits.
- **Transactional Consistency**: ACDI-compliant checkout process managed by the `BillingService`.
- **Dual Database Architecture**: Relational tracking with **MySQL/H2** (Users, Orders, Inventory) and NoSQL flexibility with **MongoDB** (Product Reviews).

---

## 🛠️ Technology Stack

### 🎨 Frontend (`/estore-frontend`)
- **Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **State**: Zustand (Local) & TanStack Query (Server)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Notifications**: Sonner

### ⚙️ Backend (`/estore-backend`)
- **Framework**: Spring Boot 3.2.x
- **Language**: Java 21
- **Domain Areas**: Catalog, Customer, Inventory, Shopping, Billing, Reviews (DDD approach)
- **Databases**: 
  - MySQL 8.x (Spring Data JPA) - *H2 Fallback supported*
  - MongoDB 6.x (Spring Data MongoDB) - *Atlas support included*
- **Security**: Spring Security + JWT Token Provider
- **Build Tool**: Maven

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:
- **Java 21** 
- **Maven 3.6+**
- **Node.js 20+** & **npm**
- **MySQL 8.0+**
- **MongoDB 6.0+**

---

## 🚦 Getting Started

### 1. Database Setup

You must have both MySQL and MongoDB running locally.

**MySQL Setup:**
```sql
CREATE DATABASE estore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
*(Configure `application.yml` inside `estore-backend/src/main/resources/` with your local MySQL credentials).*

**MongoDB Setup:**
```bash
mongosh --eval "use estore_reviews"
```

### 2. Backend Setup & Run

The backend API uses Java 21. If your default `JAVA_HOME` is an older version (e.g., Java 17), you must export the Java 21 path before running:

```bash
cd estore-backend

# Set Java 21 exactly (path for Linux/Kali provided as an example)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Clean and start the Spring Boot server
mvn clean spring-boot:run
```
> The API will be accessible over `http://localhost:8080/api`.

### 3. Frontend Setup & Run

The frontend has been natively configured to process with `npm`.

```bash
cd estore-frontend

# Install node dependencies
npm install

# Start the Vite development server
npm run dev
```

> The application UI will be accessible over `http://localhost:5173` (or `5174` if `5173` is busy).  
> Make sure the backend is running to avoid API fetch errors!

---

## 🔌 API Architecture (Frontend ↔ Backend)

- Frontend manages API requests uniformly via `estore-frontend/src/core/services/api.ts` utilizing Axios interceptors to auto-inject the JWT Authorization header.
- The `VITE_API_BASE_URL` is configured to target `http://localhost:8080/api` natively via `@/core/services` defaults.
- Backend resolves CORS allowances pointing clearly to local development URLs.

---

## 🔑 Quick Test Credentials

Below are the default provisioned user accounts loaded into the database:

| Role | Email | Password |
|------|-------|----------|
| **Customer** | `john@example.com` | `password123` |
| **Customer** | `jane@example.com` | `password123` |
| **Admin** | `admin@example.com` | `admin123` |

---

## 📜 License

This project is licensed under the MIT License.
