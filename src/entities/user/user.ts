import type { Media } from "./media";
import type { McType } from "../mcType";
import type { Gender } from "@/enums/gender";
import type { Province } from "../province";
import type { HostingStyle } from "../hostingStyle";
import type { BaseEntity } from "../baseEntity";

export interface User extends BaseEntity {
	fullName: string;
	email: string;
	phoneNumber: string;
	isMc: boolean;
	age?: number;
	nickName: string;
	credit: number;
	gender: Gender;
	isNewbie: boolean;
	workingArea: string;
	isVerified: boolean;
	description: string;
	education: string;
	height?: number;
	weight?: number;
	avatarUrl: string;
	facebook: string;
	zalo: string;
	medias: Media[];
	mcTypes: McType[];
	provinces: Province[];
	hostingStyles: HostingStyle[];
}
