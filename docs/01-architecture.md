# System Architecture

Bunchly follows a modular MERN-based architecture with clear separation
between frontend, backend, and shared utilities.

## High-Level Overview

Frontend (React + Vite)
→ API Gateway (Express)
→ Business Logic (Controllers)
→ Database (MongoDB)

## Frontend

-   Built using React + Vite
-   Tailwind CSS for styling
-   Context API for authentication state
-   Protected and guest routes
-   Modular UI components

## Backend

-   Node.js + Express
-   REST-based API design
-   JWT authentication using HTTP-only cookies
-   Layered architecture:
    -   Routes
    -   Controllers
    -   Services
    -   Models
    -   Utilities

## Database

-   MongoDB with Mongoose
-   Indexed fields for performance
-   Soft validations at schema level
