# Project Brief

## Overview

MBP is a multi-faceted platform with two distinct sides: user and admin. The project facilitates functionalities including user authentication via Google Sign-In, media management, notifications, contracts, and client reviews. The admin side provides dedicated management interfaces and APIs for overseeing operations.

## Vision & Goals

-   Deliver a robust and scalable platform for booking MCs.
-   Provide a seamless user experience through efficient authentication and API integration.
-   Ensure maintainability and extensibility via a modular architecture and clear code patterns.

## Recent Updates

-   **API Refactoring:** Unified CRUD operations in BaseApi and AdminBaseApi while retaining separate configurations. The user APIs use a centralized axios instance, whereas admin APIs maintain distinct authentication and CORS settings.
-   **Authentication Enhancements:** Updated authStore logic to properly manage and propagate Bearer tokens post-login.
-   **Improved Error & Loading Handling:** Introduced consistent loading state and error management across API calls.
-   **Code Conventions:** Adopted modern TypeScript patterns and maintained detailed git commit logs for transparent change tracking.

## Future Directions

-   Further optimize error reporting and logging mechanisms.
-   Expand API functionality and explore integrations with additional third-party services.
-   Continue refining both the user and admin interfaces based on evolving requirements.
