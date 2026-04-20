# E-Store Backend

A Spring Boot backend for an e-commerce application.

## Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Build Tool:** Maven
- **Database:** MySQL with Spring Data JPA
- **Document Database:** MongoDB for product reviews
- **Security:** Spring Security with JWT Authentication
- **API:** RESTful JSON APIs

## Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- MongoDB 6.0+

## Setup

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE estore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create MongoDB database:
```bash
mongosh --eval "use estore_reviews"
```

### 2. Configuration

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/estore_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: your_password

  data:
    mongodb:
      uri: mongodb://localhost:27017/estore_reviews
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/estore-backend-1.0.0.jar
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/profile/{userId} | Get user profile |
| PUT | /api/auth/profile/{userId} | Update user profile |

### Catalog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List all categories |
| GET | /api/categories/{id} | Get category by ID |
| GET | /api/products | List products (paginated) |
| GET | /api/products/{id} | Get product details |
| GET | /api/products/search?q={keyword} | Search products |
| GET | /api/products/featured | Get featured products |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/inventory/{productId} | Check stock |
| PUT | /api/inventory/{productId} | Update stock (Admin) |

### Shopping Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart/{userId} | Get user's cart |
| POST | /api/cart/add | Add item to cart |
| PUT | /api/cart/update | Update cart item quantity |
| DELETE | /api/cart/remove/{itemId} | Remove item from cart |
| DELETE | /api/cart/clear/{userId} | Clear entire cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create new order |
| GET | /api/orders/user/{userId} | Get user's order history |
| GET | /api/orders/{orderId} | Get order details |
| PUT | /api/orders/{orderId}/status | Update order status (Admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create product review |
| GET | /api/reviews/product/{productId} | Get product reviews |
| GET | /api/reviews/user/{userId} | Get user's reviews |

## Test Users

After running the application, the following test users will be created:

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | USER |
| jane@example.com | password123 | USER |
| admin@example.com | admin123 | ADMIN |

## JWT Authentication

To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
src/main/java/com/estore/
├── EStoreApplication.java
├── billing/           # Order management
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
├── catalog/           # Products and categories
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
├── config/            # Configuration classes
├── customer/          # User authentication
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
├── exception/         # Exception handling
├── inventory/         # Stock management
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
├── reviews/           # Product reviews (MongoDB)
│   ├── controller/
│   ├── document/
│   ├── dto/
│   ├── repository/
│   └── service/
├── security/         # JWT security
├── shared/            # Common DTOs
└── shopping/          # Cart operations
    ├── controller/
    ├── dto/
    ├── entity/
    ├── repository/
    └── service/
```

## Sample Data

The application initializes with sample data including:
- 4 Categories (Electronics, Books, Sports, Home & Garden)
- 10 Products with inventory
- 3 Test users

## License

MIT License
