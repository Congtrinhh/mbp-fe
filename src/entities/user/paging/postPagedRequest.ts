import type { PagedRequest } from "./pagedRequest";

export interface PostPagedRequest extends PagedRequest {
	postGroup?: any;
	keyWord?: string;
	isGetReaction?: boolean;
}
