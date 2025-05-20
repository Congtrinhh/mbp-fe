import type { PagedRequest } from "./../entities/user/paging/pagedRequest";
import { defineStore } from "pinia";
import type { McType } from "@/entities/mcType";
import BaseApi from "@/apis/baseApi";

const mcTypeApi = BaseApi.getInstance<McType>("mcTypes");

export const useMcTypeStore = defineStore("mcType", {
	state: () => ({
		mcTypes: [] as McType[],
	}),
	actions: {
		async fetchMcTypes() {
			try {
				const pagedRequest: PagedRequest = {
					pageIndex: 0,
					pageSize: -1,
				};
				const response = await mcTypeApi.getPaged(pagedRequest);
				this.mcTypes = response.items;
			} catch (error) {
				console.error("Failed to fetch MC Types:", error);
			}
		},
	},
});
