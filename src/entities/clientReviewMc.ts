import type { BaseEntity } from "./baseEntity";
import type { Contract } from "./contract";
import type { User } from "./user/user";

export interface ClientReviewMc extends BaseEntity {
	clientId?: number;
	mcId?: number;
	contractId?: number;
	proPoint: number;
	attitudePoint: number;
	shortDescription?: string;
	detailDescription: string;
	isActive?: boolean;
	overallPoint: number;
	reliablePoint: number;

	mc?: User;
	client?: User;
	contract?: Contract;
}
