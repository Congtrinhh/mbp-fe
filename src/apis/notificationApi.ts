import type { Notification } from "@/entities/notification";
import BaseApi from "./baseApi";

class NotificationApi extends BaseApi<Notification> {
	private static instance: NotificationApi;

	constructor() {
		super("notifications");
	}

	public static getInstance(): NotificationApi {
		if (NotificationApi.instance == null) {
			NotificationApi.instance = new NotificationApi();
		}
		return NotificationApi.instance;
	}

	public async getUnreadCount(userId: number): Promise<number> {
		const response = await BaseApi.axiosInstance.get<number>(`/${this.baseEndpoint}/unread-count/${userId}`);
		return response.data;
	}
}

export const notificationApi = NotificationApi.getInstance();
