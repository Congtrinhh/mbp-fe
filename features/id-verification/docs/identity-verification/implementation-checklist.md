# Implementation Checklist - User Identification Verification

## Database Setup

-   [✓] Create `user_id_verification` table (already exists)

    -   user_id (FK to user table)
    -   face_image_url
    -   id_front_image_url
    -   id_back_image_url
    -   current_step (0-3)
    -   status (0=pending, 1=verified)
    -   verified_at
    -   created_at
    -   updated_at

-   [✓] Create `id_info` table (already exists)
    -   user_id (FK to user table)
    -   id_number
    -   full_name
    -   date_of_birth
    -   sex
    -   nationality
    -   home_address
    -   expiry_date
    -   religion
    -   ethnicity
    -   features
    -   issue_date
    -   issue_location
    -   created_at
    -   updated_at

## Backend API Endpoints

-   [✓] Create IdentityVerificationController
    -   [✓] GET /api/identity-verification/status - Get user's current verification status
    -   [✓] POST /api/identity-verification/face - Upload face photo
    -   [✓] POST /api/identity-verification/id-card - Upload ID card photos
    -   [✓] POST /api/identity-verification/confirm - Confirm extracted information
    -   [✓] GET /api/identity-verification/info - Get extracted ID information

## Frontend Implementation

-   [✓] Create base components and utilities

    -   [✓] Camera component (integrated in capture steps)
    -   [✓] Photo preview functionality
    -   [✓] Step progress indicator
    -   [✓] API service layer
    -   [✓] Type definitions

-   [✓] Create verification flow components

    -   [✓] IdentityVerificationView with step management
    -   [✓] FaceCaptureStep component
    -   [✓] IdCardCaptureStep component
    -   [✓] InformationVerificationStep component

-   [✓] Add error handling and validations
    -   [✓] Camera access validation
    -   [✓] Photo capture validation
    -   [✓] API error handling with PrimeVue Toast
    -   [✓] Loading states
    -   [✓] Form validation in InformationVerificationStep

## Integration Points

-   [✓] Setup AWS S3 integration (implemented in backend)
-   [✓] Setup FPT.AI API integration (implemented in backend)
-   [✓] Implement mock face matching service (hardcoded to return true)

## Testing

-   [ ] Unit tests

    -   [ ] API endpoints
    -   [ ] Frontend components
    -   [ ] IdVerificationApi service
    -   [ ] Utility functions

-   [ ] Integration tests

    -   [ ] Complete verification flow
    -   [ ] Error handling scenarios
    -   [ ] Edge cases

-   [ ] End-to-end testing
    -   [ ] Happy path flow
    -   [ ] Error handling scenarios

## Documentation

-   [ ] API documentation

    -   [ ] Endpoint specifications
    -   [ ] Request/Response examples
    -   [ ] Error codes

-   [ ] Frontend documentation

    -   [ ] Component usage guides
    -   [ ] Integration guide
    -   [ ] Type definitions

-   [ ] User guide
    -   [ ] Step-by-step instructions
    -   [ ] Troubleshooting guide
