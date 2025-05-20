# Base List Component Feature Specifications

## 1. Core Component Structure

### DataTable Configuration (Using PrimeVue DataTable)

```typescript
interface BaseListProps {
	columns: Column[]; // Column definitions
	defaultSort: SortConfig; // Default sort field and order
	searchFields: string[]; // Fields to include in search
	actions: ActionConfig[]; // Row action buttons config
	permissions?: Permissions; // Optional permissions config
	pageSize?: number; // Default: 50
	customTemplates?: Templates; // Optional custom cell templates
}
```

### Column Definition

```typescript
interface Column {
	field: string; // Data field name
	header: string; // Display header
	sortable?: boolean; // Enable sorting (default: true)
	searchable?: boolean; // Include in search (default: false)
	template?: string; // Optional custom template name
	width?: string; // Optional column width
}
```

### Action Configuration

```typescript
interface ActionConfig {
	type: "view" | "edit" | "delete" | "custom";
	icon: string; // PrimeVue icon name
	tooltip?: string; // Hover tooltip
	permission?: string; // Required permission
	handler?: (row: any) => void; // Custom action handler
	confirmMessage?: string; // For actions requiring confirmation
}
```

## 2. Features

### Pagination

-   Default page size: 50
-   Available sizes: [10, 20, 50, 100]
-   Server-side pagination
-   Preserve state on filter/sort changes

### Search

-   Single search box for all configured fields
-   Debounced input (500ms)
-   Server-side filtering
-   Case-insensitive search
-   Clear button to reset

### Sorting

-   Server-side sorting
-   Multiple column support
-   Sort indicators on headers
-   Default: last updated descending

### Row Actions

-   Standard templates for common actions
-   Custom action support
-   Permission-based visibility
-   Confirmation dialogs using PrimeVue ConfirmDialog

### Dialog Templates

```typescript
interface DialogTemplates {
	view?: {
		width?: string; // Default: '70vw'
		header?: string;
		content: Component;
	};
	edit?: {
		width?: string;
		header?: string;
		content: Component;
		validation?: ValidationRules;
	};
}
```

## 3. Error Handling

### Standard Error States

-   Loading state
-   No data state
-   Error state with specific messages
-   Connection error state

### Error Messages

```typescript
interface ErrorMessages {
	connectionError: "Database connection failed";
	noData: "No records found";
	loadError: "Failed to load data";
	saveError: "Failed to save changes";
	deleteError: "Failed to delete record";
}
```

## 4. Events

### Component Events

```typescript
interface BaseListEvents {
	"update:modelValue": (value: any[]) => void;
	"row-click": (row: any) => void;
	"sort-change": (field: string, order: "asc" | "desc") => void;
	"page-change": (page: number) => void;
	search: (term: string) => void;
	error: (error: Error) => void;
}
```

## 5. API Integration

### Required Backend Endpoints

-   GET /api/{entity} - List with pagination, sorting, filtering
-   DELETE /api/{entity}/{id} - Delete record
-   GET /api/{entity}/{id} - Get single record
-   PUT /api/{entity}/{id} - Update record

### Request Parameters

```typescript
interface ListParams {
	page: number;
	pageSize: number;
	sortField?: string;
	sortOrder?: "asc" | "desc";
	search?: string;
	searchFields?: string[];
}
```

### Response Format

```typescript
interface ListResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
```

## 6. Permissions

### Permission Check Function

```typescript
interface PermissionCheck {
	canView: () => boolean;
	canEdit: () => boolean;
	canDelete: () => boolean;
	hasPermission: (permission: string) => boolean;
}
```

## 7. Usage Example

```vue
<template>
	<base-list
		:columns="columns"
		:actions="actions"
		:searchFields="['title', 'creator']"
		:defaultSort="{ field: 'updatedAt', order: 'desc' }"
		@row-click="handleRowClick"
	>
		<template #status="{ data }">
			<status-badge :value="data.status" />
		</template>
	</base-list>
</template>
```
