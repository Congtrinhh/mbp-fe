# ID Card Photo Capture Specification

## Overview

This subfeature handles the capture and validation of both front and back sides of the user's ID card (CCCD), representing steps 2 and 3 of the verification process.

## User Interface Requirements

### Common UI Elements

1. Camera view component showing live camera feed
2. Photo capture button
3. Retake button (shown after photo is taken)
4. Back button to return to previous step
5. Clear visual guide for ID card placement

### Front Side Specific

1. Visual indicators for card orientation
2. Preview of captured front side
3. Guidelines for ensuring QR code visibility (if present)

### Back Side Specific

1. Visual indicators for card orientation
2. Preview of captured back side
3. Guidelines for ensuring text readability

## Technical Requirements

### Data Storage

-   Fields in `user_id_verification` table:
    -   `id_front_image_url`: Front side photo URL
    -   `id_back_image_url`: Back side photo URL
    -   `current_step`: Updated to 2 after front capture, 3 after back capture

### Integration with FPT.AI ID Recognition API

#### API Requirements

-   API Endpoint: `https://api.fpt.ai/vision/idr/vnm/`
-   Headers:
    -   `api-key`: FPT.AI API key
-   Request: Form data with image file

#### Response Processing

1. Front Side Data:

    - ID number
    - Full name
    - Date of birth
    - Sex
    - Nationality
    - Home address
    - Expiry date

2. Back Side Data:
    - Religion
    - Ethnicity
    - Features
    - Issue date
    - Issue location

### Validation Rules

#### Image Requirements

1. Card must occupy minimum 1/4 of image area
2. All four corners must be visible
3. Text must be clearly readable
4. No glare or shadows
5. Maximum file size: 5MB
6. Minimum resolution: 640x480

#### Processing Requirements

1. API must successfully extract all required fields
2. Face in ID must match face photo from step 1
3. Both front and back must be from same ID card

### Error Handling

1. Poor image quality detection
2. Failed text extraction
3. Face mismatch detection (use a 3rd party service that will be determined later - hardcode in the service to return true for now)
4. Upload failures
5. API integration errors
6. Network connectivity issues

## Success Criteria

1. Both sides of ID captured clearly
2. Photos stored successfully in S3
3. Database updated with photo URLs
4. All required information extracted successfully
5. Face matching validation passed (use a 3rd party service that will be determined later - hardcode in the service to return true for now)

## Security Requirements

1. Secure transmission of ID photos
2. Encrypted storage
3. Access control for ID information
4. Audit logging of verification attempts
