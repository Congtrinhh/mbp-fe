# Post Management User Flow

## Main Flow - Post List View

1. User (admin) clicks on "Quản lý bài đăng tìm MC" in the admin sidebar navigation
2. System displays a grid view of all MC booking posts with the following:
    - Grid columns: title, creator, event time, event location, payment range (from-to), status (pending/approved)
    - Posts are sorted by last update time (newest first)
    - 50 records per page with pagination
    - Search toolbar in top-left corner for filtering by title/creator name
    - Action buttons for each row: approve (for pending posts), delete (admin only)

## Post Approval Flow

1. User clicks the "approve" icon for a pending post
2. System:
    - Updates post status to "approved" in database
    - Sends real-time WebSocket notification to post creator
    - Updates grid view to reflect new status

## Post Deletion Flow

1. User clicks the "delete" icon for a post
2. System displays confirmation dialog: "Bạn có muốn xóa bài viết này không?"
3. If user clicks "Cancel":
    - System closes dialog and returns to grid view
4. If user clicks "Đồng ý":
    - System deletes post from database
    - Sends real-time WebSocket notification to post creator
    - Updates grid view to remove deleted post

## Search/Filter Flow

1. User enters text in search toolbar
2. System filters grid to show only posts where:
    - Title contains search text OR
    - Creator name contains search text
3. Grid maintains pagination with filtered results
