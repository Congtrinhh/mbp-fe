import type { ReactionType } from "@/enums/reactionType";
import type { BaseEntity } from "../baseEntity";

export interface Reaction extends BaseEntity {
	postId: number;
	userId?: number;
	userName?: string;
	type: ReactionType;
}
