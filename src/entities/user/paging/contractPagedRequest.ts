import { ContractStatus } from "@/enums/contractStatus";
import type { PagedRequest } from "@/entities/user/paging/pagedRequest";

export interface ContractPagedRequest extends PagedRequest {
	clientId?: number;
	mcId?: number;
	keyWord?: string;
	status?: ContractStatus;
}
