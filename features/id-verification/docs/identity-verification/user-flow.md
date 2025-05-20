# ID Verification - User Flow

## Main Flow

1. User clicks "Xác minh danh tính" (Identity Verification) in settings screen
2. System displays overview screen with three steps:

    - Step 1: Face photo capture
    - Step 2: ID card photo capture (front and back)
    - Step 3: ID information confirmation

3. User clicks "Bắt đầu" (Start) button

### Step 1: Face Photo

4. System displays face photo capture screen
5. User takes a photo of their face
    - IF photo is clear and face is detectable:
        - System saves photo URL to `face_image_url`
        - System sets `current_step = 1`
        - CONTINUE to Step 2
    - ELSE:
        - System displays error message
        - User must retake photo

### Step 2: ID Card Photos

6. System displays ID card front capture screen
7. User takes photo of ID card front

    - IF photo is clear and card is detectable (use FPT.AI api to check the card is detectable):
        - System saves photo URL to `id_front_image_url`
        - System sets `current_step = 2`
        - CONTINUE to back side
    - ELSE:
        - System displays error message
        - User must retake photo

8. System displays ID card back capture screen
9. User takes photo of ID card back
    - IF photo is clear and card is detectable (use FPT.AI api to check the card is detectable):
        - System saves photo URL to `id_back_image_url`
        - System sets `current_step = 3`
        - System extracts information from both ID sides
        - System compares face photo with ID card photos (use a 3rd party service that will be determined later - hardcode in the service to always match for now)
        - IF face matches:
            - CONTINUE to Step 3
        - ELSE:
            - System displays error: "Ảnh chụp khuôn mặt không khớp với ảnh CCCD mặt trước và mặt sau"
            - User must restart from Step 1
    - ELSE:
        - System displays error message
        - User must retake photo

### Step 3: Information Confirmation

10. System displays extracted ID information for review
11. User verifies information and clicks "Xác nhận" (Confirm)
    -   System updates user's verification status (`is_verified = true`)
    -   System displays success toast message: "Bạn đã xác thực danh tính thành công"
    -   Process complete

## Alternative Flows

1. User can click "Quay lại" (Back) at any step to return to previous step
2. User can click "Chụp lại" (Retake) after taking any photo to retake it
3. Database connection error at any step:
    - System displays "Lỗi kết nối!" message
    - Process ends

## Technical Notes

-   All photos must follow FPT.AI's requirements:
    -   Clear 4 corners or main ID card components
    -   Clear, readable text
    -   Max 5MB, min resolution 640x480
    -   ID card must occupy at least 1/4 of image area
-   Steps are tracked in `current_step` field:
    -   0: Face photo (initial)
    -   1: ID front photo
    -   2: ID back photo
    -   3: Information confirmation
