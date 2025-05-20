import type { Media } from "@/entities/user/media";
import BaseApi from "./baseApi";
import { MediaType } from "@/enums/mediaType";

const API_URL = "/api/media";

class MediaApi extends BaseApi<Media> {
	private static instance: MediaApi;

	constructor() {
		super("medias");
	}

	public static getInstance(): MediaApi {
		if (MediaApi.instance == null) {
			MediaApi.instance = new MediaApi();
		}
		return MediaApi.instance;
	}

	public async getMediasByUserId(userId: number, mediaType: MediaType): Promise<Media[]> {
		const response = await this.getPaged({ pageIndex: 0, pageSize: -1, userId, mediaType });
		return response.items ?? [];
	}

	public async upload(media: Media): Promise<Media> {
		const formData = new FormData();
		formData.append("userId", media.userId.toString());
		formData.append("type", media.type);
		formData.append("sortOrder", media.sortOrder.toString());
		if (media.file) {
			formData.append("file", media.file);
		}

		const response = await BaseApi.axiosInstance.post(`/${this.baseEndpoint}/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	}
}

export const mediaApi = MediaApi.getInstance();
