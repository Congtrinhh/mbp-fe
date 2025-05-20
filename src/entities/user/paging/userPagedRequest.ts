import type { PagedRequest } from "./pagedRequest";

export interface UserPagedRequest extends PagedRequest {
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	isMc?: boolean;
	isVerified?: boolean;
	isNewbie?: boolean;
	nickName?: string;
	gender?: number;
	minAge?: number;
	maxAge?: number;

	// Get details
	isGetMcType?: boolean;
	isGetHostingStyle?: boolean;
	isGetMedia?: boolean;
	isGetProvince?: boolean;

	// New properties based on the provided JSON
	mcTypeIds?: string;
	hostingStyleIds?: string;
	provinceIds?: string;
	genders?: string;
}
