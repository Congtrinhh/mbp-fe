# Information Verification Specification

## Overview

This subfeature handles the final step of the ID verification process where users review and confirm their extracted ID information before completing the verification.

## User Interface Requirements

### Information Display

1. Clear, well-organized presentation of all extracted ID information:

    - ID number
    - Full name
    - Date of birth
    - Sex
    - Nationality
    - Home address
    - Expiry date
    - Religion
    - Ethnicity
    - Features
    - Issue date
    - Issue location

2. Read-only format to prevent modifications
3. Visual indicators for data accuracy/confidence levels

### Action Buttons

1. Confirm button ("Xác nhận")
2. Back button to return to previous step
3. Cancel button to abort the process

## Technical Requirements

### Data Storage

#### Tables

1. `user_id_verification`:

    - Update `status` to 1 (verified)
    - Set `verified_at` to current timestamp
    - Set `current_step` to 3

2. `id_info`:

    - Store all extracted information from both ID sides
    - Link to user via `user_id`

3. `user`:
    - Update `is_verified` to true

### Data Flow

1. Retrieve extracted information from FPT.AI API response
2. Validate all required fields are present
3. Format data according to database schema
4. Store in `id_info` table
5. Update verification status

### Error Handling

1. Missing required information
2. Database connection errors
3. Transaction failures
4. Network connectivity issues

### Success Flow

1. All information confirmed by user
2. Data successfully stored in database
3. User verification status updated
4. Success toast message displayed: "Bạn đã xác thực danh tính thành công"

## Security Requirements

1. Information displayed only to the authenticated user
2. Session validation
3. Audit logging of verification completion
4. HTTPS for all data transmission
5. Input sanitization for any user interactions

## Performance Requirements

1. Quick data retrieval and display
2. Responsive UI updates
3. Efficient database transactions
4. Handle concurrent verification requests

## Dependencies

1. FPT.AI API service
2. AWS S3 for image storage
3. Database availability
4. Network connectivity

## Testing Requirements

1. Verification status updates
2. Data persistence verification
3. Error scenario handling
4. Security controls validation
5. Performance under load
