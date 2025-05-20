import { type PagedRequest } from "./pagedRequest";
import { MediaType } from "@/enums/mediaType";

export interface MediaPagedRequest extends PagedRequest {
	userId?: number;
	mediaType?: MediaType;
}
