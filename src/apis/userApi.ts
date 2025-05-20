import type { User } from "@/entities/user/user";
import BaseApi from "./baseApi";

class UserApi extends BaseApi<User> {
	private static instance: UserApi;

	constructor() {
		super("users");
	}

	public static getInstance(): UserApi {
		if (UserApi.instance == null) {
			UserApi.instance = new UserApi();
		}
		return UserApi.instance;
	}

	public async uploadAvatar(userId: number, file: File): Promise<User> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await BaseApi.axiosInstance.post<User>(`/${this.baseEndpoint}/${userId}/avatar`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	}
}

export const userApi = UserApi.getInstance();
