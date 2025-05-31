import type { BaseEntity } from "./baseEntity";
import { ContractStatus } from "../enums/contractStatus";
import type { User } from "./user/user";

export interface Contract extends BaseEntity {
	mcId: number;
	clientId: number;
	eventName: string;
	eventStart: Date;
	eventEnd: Date;
	description: string;
	place: string;
	mcCancelDate?: Date | null;
	mcCancelReason?: string | null;
	clientCancelDate?: Date | null;
	clientCancelReason?: string | null;
	isActive?: boolean;
	status?: ContractStatus;
	isIgnoreBufferCheck?: boolean;

	client?: User;
	mc?: User;
}
