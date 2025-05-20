import type { BaseEntity } from "./baseEntity";

export interface UserIdVerification extends BaseEntity {
	userId: number;
	faceImageUrl: string;
	idFrontImageUrl: string;
	idBackImageUrl: string;
	currentStep: number;
	status: number;
	verifiedAt: Date | null;
	errorMessage: string;
}

export interface IdInfo extends BaseEntity {
	userId: number;
	idNumber: string;
	name: string;
	dob: Date | null;
	sex: string;
	nationality: string;
	home: string;
	address: string;
	doe: Date | null;
	religion: string | null;
	ethnicity: string | null;
	features: string;
	issueDate: Date | null;
	issueLoc: string;
}

export interface FacePhotoUploadDto {
	imageBase64: string;
}

export interface IdCardPhotoUploadDto {
	imageBase64: string;
	side: "front" | "back";
}
