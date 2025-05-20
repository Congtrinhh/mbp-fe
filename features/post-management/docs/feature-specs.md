# Post Management Feature Specifications

## 1. Grid View Component

### Grid Configuration

-   **Page Size**: 50 records per page
-   **Sort Order**: Descending by last update time
-   **Columns**:
    -   Title (string)
    -   Creator (string)
    -   Event Time (datetime)
    -   Event Location (string)
    -   Payment Range (numeric range)
    -   Status (enum: pending/approved)

### Search Functionality

-   **Location**: Top-left toolbar
-   **Target Fields**: Title, Creator name
-   **Search Type**: Contains (case-insensitive)
-   **Update**: Real-time as user types

### Action Buttons

-   **Approve Button**:
    -   Only visible for posts with "pending" status
    -   Icon-based button
    -   Requires admin/employee role
-   **Delete Button**:
    -   Always visible
    -   Icon-based button
    -   Requires admin role only

## 2. Post Approval Feature

### Backend Requirements

-   **Endpoint**: PUT /api/posts/{id}/approve
-   **Authorization**: Admin/Employee role required
-   **Response**: Updated post object

### WebSocket Notification

-   **Event Type**: POST_APPROVED
-   **Payload**:
    ```typescript
    {
    	postId: string;
    	title: string;
    	approvedAt: DateTime;
    	approvedBy: string;
    }
    ```

## 3. Post Deletion Feature

### Confirmation Dialog

-   **Title**: "Xác nhận"
-   **Message**: "Bạn có muốn xóa bài viết này không?"
-   **Buttons**:
    -   Confirm: "Đồng ý"
    -   Cancel: "Hủy"

### Backend Requirements

-   **Endpoint**: DELETE /api/posts/{id}
-   **Authorization**: Admin role required
-   **Response**: Success status code

### WebSocket Notification

-   **Event Type**: POST_DELETED
-   **Payload**:
    ```typescript
    {
    	postId: string;
    	title: string;
    	deletedAt: DateTime;
    	deletedBy: string;
    }
    ```

## 4. Access Control

### Role Requirements

-   View posts: Admin/Employee role
-   Approve posts: Admin/Employee role
-   Delete posts: Admin role only

### Authentication

-   JWT token required in request headers
-   Role validation on both frontend and backend

## 5. WebSocket Integration

### Connection

-   Establish WebSocket connection when user logs in
-   Maintain heartbeat for connection stability
-   Reconnect automatically on connection loss

### Events

-   Listen for POST_APPROVED and POST_DELETED events
-   Update UI immediately upon receiving events
-   Display toast notifications for relevant users
