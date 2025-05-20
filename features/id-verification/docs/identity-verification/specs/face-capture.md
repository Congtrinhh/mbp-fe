# Face Photo Capture Specification

## Overview

This subfeature handles the capture and validation of the user's face photo, which is the first step in the identity verification process.

## User Interface Requirements

1. Camera view component that shows live camera feed
2. Photo capture button
3. Retake button (shown after photo is taken)
4. Back button to return to overview
5. Clear instructions for optimal face photo capture

## Technical Requirements

### Data Storage

-   Field: `face_image_url` in `user_id_verification` table
-   Image stored in AWS S3
-   `current_step` updated to 1 after successful capture

### Validation Rules

1. Face must be clearly visible
2. Good lighting conditions
3. Neutral background preferred
4. Photo must be under 5MB
5. Minimum resolution: 640x480

### API Integration

-   Face detection API to verify photo quality (a 3rd party service that will be determined later - hardcode in the service to return true for now)
-   AWS S3 for image storage
-   Update verification status in database

### Error Handling

1. Poor image quality detection
2. Failed face detection
3. Upload failures
4. Network connectivity issues

## Success Criteria

-   Clear face photo captured
-   Photo stored successfully in S3
-   Database updated with photo URL
-   Face detection validation passed
