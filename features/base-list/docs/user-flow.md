# Base List Component User Flow

## Main Grid View Flow

1. User navigates to any admin list page
2. System displays the data grid with:
    - Configurable columns based on entity data
    - Default sort by last updated timestamp (descending)
    - 50 records per page (configurable via dropdown: 10, 20, 50, 100)
    - Search box in top-left toolbar
    - Action buttons per row based on configuration
    - Loading indicator during data fetch

## Search Flow

1. User types in search box
2. System:
    - Debounces input for 500ms
    - Searches across all configured searchable fields
    - Updates grid with matched records
    - Shows "No results found" if no matches
    - Preserves current sort and page size

## Sorting Flow

1. User clicks any column header
2. System:
    - Toggles sort direction (ascending/descending)
    - Updates arrow indicator on column
    - Reloads data with new sort
    - Preserves current search and page size

## Pagination Flow

1. User:
    - Navigates between pages using prev/next buttons
    - Selects specific page number
    - Changes records per page via dropdown
2. System:
    - Updates displayed records
    - Preserves current search and sort
    - Shows loading indicator during fetch

## Record Actions Flow

1. User double-clicks any row (if has view/edit permission)
2. System displays view/edit dialog with:
    - Record details in read-only or edit mode
    - Standard layout based on dialog templates
    - Action buttons based on permissions

## Error Handling Flow

1. If database connection fails:

    - System displays "Database connection failed" message
    - Shows retry button
    - Preserves current search/sort/page settings

2. If other errors occur:
    - System shows appropriate error message
    - Allows custom error handlers if configured
    - Maintains grid state for recovery

## Action Button Flow

1. For delete/disable actions:

    - System shows PrimeVue confirmation dialog
    - Executes action on confirm
    - Shows success/error toast message
    - Refreshes grid data if successful

2. For edit/custom actions:
    - System triggers configured callback handler
    - Parent component handles specific logic
    - Base component handles common UI updates
