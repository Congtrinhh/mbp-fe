// Types for MBaseForm component
// created by: AI Assistant 30/04/2025

import { z } from "zod";
import { AdminBaseApi } from "@/apis/adminBaseApi";
import { type BaseEntity } from "@/entities/baseEntity";

/**
 * Field UI configuration
 */
export interface FieldUIConfig {
	label: string; // Display label
	type: string; // PrimeVue component type
	order?: number; // Display order in form
	props?: Record<string, any>; // PrimeVue component props
	disabled?: boolean; // Field disabled state
	readonly?: boolean; // Field readonly state
	hidden?: boolean; // Hide field in this mode
}

/**
 * Form field configuration combining Zod schema and UI config
 */
export interface FieldConfig {
	key: string; // Field identifier
	schema: z.ZodTypeAny; // Zod validation schema
	ui: FieldUIConfig; // UI configuration
}

/**
 * Mode-specific overrides for field UI config
 */
export type ModeOverrides = Record<string, Partial<FieldUIConfig>>;

/**
 * Form configuration interface
 */
export interface FormConfig<T extends BaseEntity = BaseEntity> {
	fields: FieldConfig[]; // Array of field configurations
	api: AdminBaseApi<T>; // API instance for CRUD operations
	modes?: {
		view?: ModeOverrides; // View mode overrides
		edit?: ModeOverrides; // Edit mode overrides
		add?: ModeOverrides; // Add mode overrides
	};
}

/**
 * Helper functions for working with form fields
 */
export const formUtils = {
	/**
	 * Create a form field configuration
	 */
	createField(key: string, schema: z.ZodTypeAny, ui: FieldUIConfig): FieldConfig {
		return { key, schema, ui };
	},

	/**
	 * Create a validation schema from form fields
	 */
	createSchema(fields: FieldConfig[]): z.ZodObject<any> {
		const shape = fields.reduce((acc, field) => {
			acc[field.key] = field.schema;
			return acc;
		}, {} as Record<string, z.ZodTypeAny>);

		return z.object(shape);
	},
};
