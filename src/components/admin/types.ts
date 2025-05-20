export interface BaseEntity {
	id: number;
	[key: string]: any;
}

export interface ColumnDef {
	field: string;
	header: string;
	sortable?: boolean;
	searchable?: boolean;
	template?: string;
	width?: string;
}

export interface ActionConfig {
	type: "view" | "edit" | "delete" | "custom";
	icon: string;
	tooltip?: string;
	permission?: string;
	handler?: (row: BaseEntity) => void;
	confirmMessage?: string;
}

export interface ListParams {
	pageIndex: number; //start from 0
	pageSize: number; // default 50, can be of set 5, 10, 20, 50, 100
	sortField?: string; //backend need to make field name snake_case for db search
	sortOrder?: "asc" | "desc";
	search?: string; //search term
	searchFields?: string[]; //backend need to make field names snake_case for db search
}

export interface ListResponse<T extends BaseEntity> {
	items: T[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
