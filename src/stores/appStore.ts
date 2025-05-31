import { defineStore } from "pinia";
import { useProvinceStore } from "./provinceStore";
import { useMcTypeStore } from "./mcTypeStore";
import { useHostingStyleStore } from "./hostingStyleStore";
import { notificationApi } from "@/apis/notificationApi";
import { useAuthStore } from "./authStore";

export const useAppStore = defineStore("app", {
	state: () => ({
		appName: "MBP",
		// số lượng thông báo chưa đọc
		unreadNotificationCount: 0,
	}),
	actions: {
		async initializeApp() {
			const provinceStore = useProvinceStore();
			const mcTypeStore = useMcTypeStore();
			const hostingStyleStore = useHostingStyleStore();

			provinceStore.fetchProvinces();
			mcTypeStore.fetchMcTypes();
			hostingStyleStore.fetchHostingStyles();

			const authStore = useAuthStore();
			if (authStore.user) {
				const unreadCount = await notificationApi.getUnreadCount(authStore.user.id);
				this.unreadNotificationCount = unreadCount;
			}
		},
	},
});
