import type { EntityState } from "@/enums/entityState";

export interface BaseEntity {
	id: number;
	createdAt?: Date;
	modifiedAt?: Date;
	createdBy?: number;
	modifiedBy?: number;
	entityState: EntityState;
}
