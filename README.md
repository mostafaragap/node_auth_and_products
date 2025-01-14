# Application Documentation

## Overview
This application is built using **NestJS** and leverages **Prisma** as the ORM. It includes modules for authentication, product management, and more. It is designed with best practices for scalability, security, and performance.

## Features
- Authentication module with secure user management.
- Product module for managing inventory with Redis caching.
- Pagination support for data retrieval.
- Middleware and decorators for request validation and handling.
- Dockerized setup for easy deployment.

## File Structure
```
├── src
│   ├── auth
│   │   ├── decorators
│   │   │   ├── roles.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── dto
│   │   │   ├── login-user.dto.ts
│   │   │   ├── register-user.dto.ts
│   │   │   └── index.ts
│   │   ├── guards
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── repository
│   │   │   ├── repository.service.spec.ts
│   │   │   └── user.repository.ts
│   │   ├── strategy
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts
│   ├── interceptors
│   │   ├── cache.interceptor.spec.ts
│   │   ├── cache.interceptor.ts
│   │   └── exclude-password.interceptor.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.spec.ts
│   │   └── prisma.service.ts
│   ├── product
│   │   ├── dto
│   │   │   ├── create-product.dto.ts
│   │   │   ├── pagination.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── index.ts
│   │   ├── repository
│   │   │   ├── product.repository.spec.ts
│   │   │   └── product.repository.ts
│   │   ├── product.controller.spec.ts
│   │   ├── product.controller.ts
│   │   ├── product.module.ts
│   │   ├── product.service.spec.ts
│   │   └── product.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma
│   ├── prisma.module.ts
│   ├── prisma.service.spec.ts
│   └── prisma.service.ts
├── .env
├── .eslintrc.js
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── tsconfig.json
```

## Prerequisites
- **Node.js**: v20+
- **Docker**: Installed and running
- **Redis**: For caching

## Setup

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=postgresql://postgres:123@localhost:5432/auth_product_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=strongSecretKey
   ```

4. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the application**:
   ```bash
   npm run start:dev
   ```

6. **Access the application**:
   Open `http://localhost:3000` in your browser.

7. **Access Swagger Documentation**:
   Swagger documentation is available at:
   ```
   http://localhost:3000/api
   ```

### Running with Docker
1. **Build the Docker image**:
   ```bash
   docker build -t <image-name> .
   ```

2. **Run the container**:
   ```bash
   docker-compose up
   ```

3. **Access the application**:
   Open `http://localhost:3000` in your browser.

4. **Access Swagger Documentation**:
   Swagger documentation is available at:
   ```
   http://localhost:3000/api
   ```
   
## Testing
Run unit tests to ensure application functionality:
```bash
npm run test
```
Check test coverage:
```bash
npm run test:coverage
```

## Caching
The application uses Redis for caching product data. Cache is invalidated on product updates or deletions.

## Pagination
The application includes a custom pagination decorator for consistent response formatting. Pagination metadata includes `totalItems`, `totalPages`, `currentPage`, and `itemsPerPage`.

## License
This application is licensed under the MIT License.
