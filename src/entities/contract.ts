import type { BaseEntity } from "./baseEntity";
import { ContractStatus } from "../enums/contractStatus";
import type { User } from "./user/user";

export interface Contract extends BaseEntity {
	mcId: number;
	clientId: number;
	eventName: string;
	eventStart: string;
	eventEnd: string;
	description: string;
	place: string;
	mcCancelDate?: string | null;
	mcCancelReason?: string | null;
	clientCancelDate?: string | null;
	clientCancelReason?: string | null;
	isActive?: boolean;
	status?: ContractStatus;
	isIgnoreBufferCheck?: boolean;

	client?: User;
	mc?: User;
}
