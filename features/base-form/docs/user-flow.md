# Base Form User Flow

1. The form is triggered from a parent page (e.g., MCManagement.vue) in one of three modes:

    - View: Double-clicking a row in the grid
    - Edit: Clicking the edit icon in a grid row
    - Add: Clicking the create button in the grid toolbar

2. Form Opening

    - Modal dialog appears centered on screen
    - Title shows "Chi tiết" (View), "Cập nhật" (Edit), or "Thêm mới" (Add)
    - Form fields are populated with data (View/Edit) or empty (Add)
    - Fields are read-only in View mode

3. Form Field Interaction

    - User can enter/modify data in enabled fields
    - Required fields are marked with red asterisk (\*)
    - Validation occurs on field blur and form submission
    - Validation errors appear below fields in red
    - Long validation messages show truncated with full text in tooltip

4. Form Submission (Edit/Add modes)

    - User clicks Update/Create button
    - If validation fails:
        - Error messages display below invalid fields
        - Form remains open for corrections
    - If validation passes:
        - Loading overlay appears with spinner
        - All fields and buttons are disabled
        - API request is made
        - On success:
            - Success toast appears
            - Modal closes
            - Parent grid refreshes
        - On error:
            - Error toast shows "Lỗi kết nối!" or specific error
            - Form returns to editable state

5. Form Cancellation

    - User can click Cancel button or X icon
    - Form closes without saving
    - No confirmation needed
    - Parent grid state remains unchanged

6. View Mode Actions
    - User can only view data
    - Only Close button is available
    - Clicking Close returns to parent grid
