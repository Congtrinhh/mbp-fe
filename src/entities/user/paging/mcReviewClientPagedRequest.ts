import type { PagedRequest } from "./pagedRequest";

export interface McReviewClientPagedRequest extends PagedRequest {
	clientId?: number;
	isGetContract?: boolean;
	isGetMc?: boolean;
	isGetClient?: boolean;
}
