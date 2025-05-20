export interface PagedResponse<T> {
	items: T[];
	totalCount: number;
	pageSize: number;
	pageIndex: number;
}
