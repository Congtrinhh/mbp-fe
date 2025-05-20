import type { UserIdVerification, IdInfo } from "@/entities/idVerification";
import BaseApi from "./baseApi";
import { showLoading, hideLoading } from "@/composables/useLoading";

class IdVerificationApi extends BaseApi<UserIdVerification> {
	private static instance: IdVerificationApi;
	constructor(baseUrl?: string) {
		super("identity-verification", baseUrl);
	}

	public static getInstance(): IdVerificationApi {
		if (IdVerificationApi.instance == null) {
			IdVerificationApi.instance = new IdVerificationApi();
		}
		return IdVerificationApi.instance;
	}

	public async getStatus(isShowLoading: boolean = true): Promise<UserIdVerification> {
		if (isShowLoading) showLoading();
		try {
			const response = await BaseApi.axiosInstance.get<UserIdVerification>(`/${this.baseEndpoint}/status`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async uploadFacePhoto(imageBase64: string, isShowLoading: boolean = true): Promise<UserIdVerification> {
		if (isShowLoading) showLoading();
		try {
			const response = await BaseApi.axiosInstance.post<UserIdVerification>(`/${this.baseEndpoint}/face`, {
				imageBase64,
			});
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async uploadIdCardPhoto(
		imageBase64: string,
		side: "front" | "back",
		isShowLoading: boolean = true
	): Promise<UserIdVerification> {
		if (isShowLoading) showLoading();
		try {
			const response = await BaseApi.axiosInstance.post<UserIdVerification>(`/${this.baseEndpoint}/id-card`, {
				imageBase64,
				side,
			});
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async getIdInfo(isShowLoading: boolean = true): Promise<IdInfo> {
		if (isShowLoading) showLoading();
		try {
			const response = await BaseApi.axiosInstance.get<IdInfo>(`/${this.baseEndpoint}/info`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async confirmInfo(info: IdInfo, isShowLoading: boolean = true): Promise<void> {
		if (isShowLoading) showLoading();
		try {
			await BaseApi.axiosInstance.post(`/${this.baseEndpoint}/confirm`, info);
		} finally {
			if (isShowLoading) hideLoading();
		}
	}
}

// Export a singleton instance using BaseApi's getInstance
const idVerificationApi = IdVerificationApi.getInstance();
export { idVerificationApi };
