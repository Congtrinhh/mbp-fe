# System Patterns

## Overview

MBP employs a modular architecture that distinctly separates the user and admin sides while sharing common design principles. The project leverages unified CRUD operations across APIs, yet maintains separate configurations for authentication and CORS, ensuring both consistency and security.

## Architectural Decisions

-   **Unified API Pattern:**  
    BaseApi and AdminBaseApi implement consistent CRUD methods, allowing easier maintenance and scalability.
-   **Singleton Pattern:**  
    API instances are managed as singletons for each endpoint to optimize resource usage.
-   **Separation of Concerns:**  
    User and admin operations are clearly divided by using distinct axios instances.
-   **State Management:**  
    Centralized state management is achieved using Pinia, enhancing reactivity and consistency within the app.
-   **Integration:**  
    SignalR is integrated within authStore for real-time notifications, complementing traditional HTTP-based API operations.

## Recent Changes

-   Refactored BaseApi and AdminBaseApi to consolidate common logic while preserving separate configurations.
-   Enhanced authStore to ensure proper token management across API calls and SignalR connections.
-   Adopted modern TypeScript practices and improved error/loading state handling.

## Git Commit Highlights

-   "Refactored BaseApi and AdminBaseApi for unified CRUD operations"
-   "Enhanced authStore for proper token management in API calls"
