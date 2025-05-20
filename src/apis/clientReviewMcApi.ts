import type { ClientReviewMc } from "@/entities/clientReviewMc";
import BaseApi from "./baseApi";

class ClientReviewMcApi extends BaseApi<ClientReviewMc> {
	private static instance: ClientReviewMcApi;

	constructor() {
		super("clientReviewMcs");
	}

	public static getInstance(): ClientReviewMcApi {
		if (ClientReviewMcApi.instance == null) {
			ClientReviewMcApi.instance = new ClientReviewMcApi();
		}
		return ClientReviewMcApi.instance;
	}
}

export const clientReviewMcApi = ClientReviewMcApi.getInstance();
