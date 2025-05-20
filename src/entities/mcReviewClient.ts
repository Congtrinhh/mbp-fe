import type { BaseEntity } from "./baseEntity";
import type { Contract } from "./contract";
import type { User } from "./user/user";

export interface McReviewClient extends BaseEntity {
	clientId?: number;
	mcId?: number;
	contractId?: number;
	paymentPunctualPoint: number;
	shortDescription?: string;
	detailDescription: string;
	isActive?: boolean;
	overallPoint: number;
	reliablePoint: number;

	mc?: User;
	client?: User;
	contract?: Contract;
}
