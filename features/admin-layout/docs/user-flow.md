# Admin Layout User Flow

## Initial Access Flow

1. User enters `/admin` URL in browser

    - System checks localStorage for `mbp_admin_token`
        - If token exists:
            - System sends token to backend for validation
                - If validation successful: Proceed to step 3
                - If validation fails: Proceed to step 2
        - If token doesn't exist: Proceed to step 2

2. Login Flow

    - System redirects to `/admin/login`
    - User enters username and password
    - User clicks "Login" button
        - During development phase: Empty credentials are allowed for successful login
        - In production: System validates credentials against database
            - If valid: Proceed to step 3
            - If invalid: Display error message and stay on login page

3. Dashboard Access
    - System loads dashboard layout at `/admin` path
    - Layout components are rendered:
        - Sidebar (300px width):
            - MBP logo at top
            - Navigation items below:
                - MCs and Clients
                - Posts
                - Categories (with sub-items):
                    - MC Types
                    - Hosting Styles
                - Role Management (with sub-items):
                    - Employees
                    - Roles
                - System (with sub-items):
                    - Activity Logs
        - Header (60px height):
            - Account icon in top-right corner
                - Dropdown items on click:
                    - Account Information
                    - Change Password (admin only)
                    - Logout
        - Main content area:
            - Displays content based on selected navigation item

## Navigation Flow

1. When user clicks "MCs and Clients":

    - System navigates to `/admin/mc`
    - Displays MC and client management interface

2. When user clicks "Posts":

    - System navigates to `/admin/post`
    - Displays post management interface

3. When user expands "Categories":

    - When user clicks "MC Types":
        - System navigates to `/admin/category/mc-type`
        - Displays MC type management interface
    - When user clicks "Hosting Styles":
        - System navigates to `/admin/category/hosting-style`
        - Displays hosting style management interface

4. When user expands "Role Management":

    - When user clicks "Employees":
        - System navigates to `/admin/role-management/employee`
        - Displays employee management interface
    - When user clicks "Roles":
        - System navigates to `/admin/role-management/role`
        - Displays role management interface

5. When user expands "System":
    - When user clicks "Activity Logs":
        - System navigates to `/admin/system/activity-log`
        - Displays activity log interface

## Account Management Flow

1. When user clicks account icon:

    - System displays dropdown menu

2. When user selects dropdown item:
    - "Account Information":
        - System displays user account details
    - "Change Password" (admin only):
        - System displays password change interface
    - "Logout":
        - System clears admin token from localStorage
        - Redirects to login page
