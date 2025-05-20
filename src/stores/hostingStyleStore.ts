import { defineStore } from "pinia";
import type { PagedRequest } from "./../entities/user/paging/pagedRequest";
import type { HostingStyle } from "@/entities/hostingStyle";
import BaseApi from "@/apis/baseApi";

const hostingStyleApi = BaseApi.getInstance<HostingStyle>("hostingStyles");

export const useHostingStyleStore = defineStore("hostingStyle", {
	state: () => ({
		hostingStyles: [] as HostingStyle[],
	}),
	actions: {
		async fetchHostingStyles() {
			try {
				const pagedRequest: PagedRequest = {
					pageIndex: 0,
					pageSize: -1,
				};
				const response = await hostingStyleApi.getPaged(pagedRequest);
				this.hostingStyles = response.items;
			} catch (error) {
				console.error("Failed to fetch Hosting Styles:", error);
			}
		},
	},
});
