# E-Commerce API Project
## See README.th.md for Thai language

This project is a RESTful API implementation for an e-commerce system, developed to learn web development, API design, and to pass the class.

## Requirements that the project met

### 1. API Design & Architecture
* **RESTful Standard**: Resources (Users, Products, Orders) are managed via standard HTTP methods.
* **URI Structure**: Clean and meaningful URI design.
* **Versioning**: API is served under `/api/v1`.
* **Code Structure**: Follows MVC pattern and SOLID design principles.

### 2. Security Mechanisms
* **Authentication**: Implemented using **JWT**.
* **Authorization**: RBAC for `Admin` and `User`.
* **Rate Limiting**: Restricted request frequency using `express-rate-limit`.
* **Security Headers**: Applied via `helmet`.

### 3. Reliability & Data Integrity
* **Idempotency**: Prevents duplicate operations on critical endpoints e.g., Orders.
* **Validation**: Input validation for API requests.
* **Error Handling**: Centralized error handling mechanism.

### 4. Performance & Monitoring
* **Caching**: Implemented to speed up data retrieval.
* **Logging**: Integrated `winston` for system logs and `morgan` for HTTP traffic.
* **Unit Tests**: Comprehensive tests using **Jest** and **Supertest**.
* **Documentation**: Auto-generated API documentation using **Swagger**.

## Getting Started

### Prerequisites
* Node.js
* MongoDB

### Setup
1.  Install dependencies:
    ```
    npm install
    ```
2.  Configure `.env` file (see `.env.example`).
3.  Start server:
    ```
    npm start
    ```
    or
    ```
    npm run dev
    ```
4.  Access API Documentation:
    * URL: `http://localhost:yourport/api-docs`