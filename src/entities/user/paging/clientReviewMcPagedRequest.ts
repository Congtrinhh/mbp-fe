import type { PagedRequest } from "./pagedRequest";

export interface ClientReviewMcPagedRequest extends PagedRequest {
	mcId?: number;
	isGetContract?: boolean;
	isGetMc?: boolean;
	isGetClient?: boolean;
}
