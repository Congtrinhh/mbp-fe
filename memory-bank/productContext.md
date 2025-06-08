# Product Context

## Purpose

MBP is designed to streamline and enhance the booking process for MC services. It addresses the needs of both end-users and administrators by offering an intuitive, scalable platform that simplifies authentication, media management, notifications, contract handling, and client reviews.

## Problems Solved

-   **For End-Users:**
    -   Simplifies booking and event management through a user-friendly interface.
    -   Integrates secure authentication using Google Sign-In.
    -   Provides seamless access to media and notifications related to bookings.
-   **For Administrators:**
    -   Offers dedicated management tools to oversee user activities, contracts, and notifications.
    -   Maintains distinct API configurations ensuring secure and efficient data operations.

## Key Considerations

-   Integration with third-party services (e.g., Google Sign-In).
-   Dual-system architecture maintaining separate logic for user and admin functionalities.
-   A focus on maintainability with modular API designs and centralized state management.

## Recent Influence

-   Refactoring of API modules (BaseApi and AdminBaseApi) to unify CRUD operations while keeping configurations separate.
-   Enhancements in authentication processes via authStore updates.
-   Consistent error and loading state handling across the platform.
