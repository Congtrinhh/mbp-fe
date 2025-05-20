export interface PagedRequest {
	pageIndex: number;
	pageSize: number;
	sort?: string;
	isUseProc?: boolean;
}
