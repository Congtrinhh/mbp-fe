import type { BaseEntity } from "./baseEntity";

export interface Province extends BaseEntity {
	code: string;
	name: string;
	fullName: string;
	fullNameEn: string;
	codeName: string;
	sortOrder: number;
}
