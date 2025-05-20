import { defineStore } from "pinia";
import BaseApi from "@/apis/baseApi";
import type { Province } from "@/entities/province";
import type { PagedRequest } from "@/entities/user/paging/pagedRequest";

const provinceApi = BaseApi.getInstance<Province>("provinces");

export const useProvinceStore = defineStore("province", {
	state: () => ({
		provinces: [] as Province[],
	}),
	actions: {
		async fetchProvinces() {
			try {
				const pagedRequest: PagedRequest = {
					pageIndex: 0,
					pageSize: -1,
					sort: "sort_order DESC,full_name",
				};
				const response = await provinceApi.getPaged(pagedRequest);
				this.provinces = response.items;
			} catch (error) {
				console.error("Failed to fetch Provinces:", error);
			}
		},
	},
});
