# Base Form Feature Specifications

## 1. Dialog Layout and Structure

### 1.1 Dialog Container

-   Fixed width: 600px
-   Adaptive height: fit content up to 90vh
-   Centered on screen
-   Modal backdrop with dark overlay

### 1.2 Dialog Header

-   Title on left: "Thêm mới"/"Cập nhật"/"Chi tiết" based on mode
-   Close (X) button on right
-   Fixed height, non-scrollable

### 1.3 Dialog Body

-   Scrollable content area
-   24px padding on all sides
-   White background
-   Maximum height: calculated from dialog height minus header/footer

### 1.4 Dialog Footer

-   Fixed height, non-scrollable
-   Right-aligned buttons
-   Button layout by mode:
    -   Add: [Cancel] [Create]
    -   Edit: [Cancel] [Update]
    -   View: [Close]

## 2. Form Configuration

### 2.1 Schema Configuration

```typescript
interface FormConfig {
	schema: z.ZodObject<any>; // Zod schema with UI metadata
	api: {
		get?: string; // GET endpoint for single record
		create?: string; // POST endpoint for creation
		update?: string; // PUT endpoint for updates
	};
	modes?: {
		view?: Record<string, Partial<FieldMetadata>>; // View mode overrides
		edit?: Record<string, Partial<FieldMetadata>>; // Edit mode overrides
		add?: Record<string, Partial<FieldMetadata>>; // Add mode overrides
	};
}

interface FieldMetadata {
	label: string; // Display label
	type: string; // PrimeVue component type
	order?: number; // Display order in form
	props?: Record<string, any>; // PrimeVue component props
	disabled?: boolean; // Field disabled state
	hidden?: boolean; // Hide field in this mode
}
```

Example usage:

```typescript
const schema = z.object({
	name: z.string().min(1, "Trường này là bắt buộc").max(100, "Không được vượt quá 100 ký tự").meta({
		label: "Tên",
		type: "InputText",
		order: 1,
	}),
	description: z
		.string()
		.max(500, "Không được vượt quá 500 ký tự")
		.optional()
		.meta({
			label: "Mô tả",
			type: "Textarea",
			order: 2,
			props: {
				rows: 3,
				autoResize: true,
			},
		}),
	is_active: z.boolean().optional().meta({
		label: "Đang sử dụng",
		type: "Checkbox",
		order: 3,
	}),
});

const formConfig: FormConfig = {
	schema,
	api: {
		get: "/api/items/:id",
		create: "/api/items",
		update: "/api/items/:id",
	},
	modes: {
		add: {
			is_active: { disabled: true },
		},
		view: {
			description: { props: { rows: 5 } },
		},
	},
};
```

## 3. Form Fields

### 3.1 Field Layout

-   Single column layout
-   Label above field
-   4px spacing between label and field
-   16px spacing between field groups
-   Required indicator (red \*) next to label
-   Error message below field (red text, single line with tooltip)

### 3.2 Field States

-   Normal: Default PrimeVue styling
-   Required: Red asterisk (\*) beside label
-   Error: Red border + error message
-   Disabled: Semi-transparent
-   Read-only: Gray background (View mode)

### 3.3 Field Types

-   Support all PrimeVue form components
-   Most common components:
    -   InputText
    -   Dropdown
    -   Calendar
    -   InputNumber
    -   Checkbox
    -   TextArea
    -   Password

## 4. Validation

### 4.1 Client-side Validation

-   Uses Zod.js schemas with metadata
-   Validates on:
    -   Field blur
    -   Form submission
-   Mode-specific validation rules through schema refinements
-   No validation in View mode

### 4.2 Error Display

-   Field-level errors shown below fields
-   Single line truncation with tooltip
-   Red text color (#dc2626)
-   Standard error messages for common rules:
    -   Required: "Trường này là bắt buộc"
    -   MaxLength: "Không được vượt quá {n} ký tự"
    -   MinLength: "Phải có ít nhất {n} ký tự"
    -   Pattern: "Giá trị không hợp lệ"

## 5. API Integration

### 5.1 Data Loading

-   GET request on open for View/Edit modes
-   Loading overlay during request
-   Error toast on failure

### 5.2 Data Submission

-   POST/PUT request on form submit
-   Full form overlay with centered spinner
-   All fields and buttons disabled
-   Success/Error toast messages
-   Parent grid refresh on success

### 5.3 Error Handling

-   Connection error: "Lỗi kết nối!"
-   Validation errors from server shown under fields
-   Generic error: "Đã có lỗi xảy ra"

## 6. Performance Considerations

### 6.1 Form Initialization

-   Lazy loading of PrimeVue components
-   Schema compilation only on first use
-   Caching of loaded data

### 6.2 Runtime Performance

-   Debounced validation (300ms)
-   Throttled API calls
-   Optimized re-rendering
