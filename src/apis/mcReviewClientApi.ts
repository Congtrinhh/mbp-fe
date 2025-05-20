import type { McReviewClient } from "@/entities/mcReviewClient";
import BaseApi from "./baseApi";

class McReviewClientApi extends BaseApi<McReviewClient> {
	private static instance: McReviewClientApi;

	constructor() {
		super("mcReviewClients");
	}

	public static getInstance(): McReviewClientApi {
		if (McReviewClientApi.instance == null) {
			McReviewClientApi.instance = new McReviewClientApi();
		}
		return McReviewClientApi.instance;
	}
}

export const mcReviewClientApi = McReviewClientApi.getInstance();
