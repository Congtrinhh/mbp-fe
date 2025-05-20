import type { BaseEntity } from "../baseEntity";
import type { User } from "./user";

export interface Post extends BaseEntity {
	id: number;
	userId: number;
	caption?: string;
	postGroup?: number;
	place: string;
	eventName: string;
	eventStart?: Date;
	eventEnd?: Date;
	priceFrom?: number;
	priceTo?: number;
	mcRequirement: string;
	detailDesc?: string;
	user?: User;
	reactions: any[];
}
