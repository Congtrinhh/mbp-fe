import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes, setupAdminRouteGuard } from "./adminRoutes";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		...adminRoutes,
		{
			path: "/",
			name: "user",
			component: () => import("@/views/user/layout/UserLayout.vue"),
			children: [
				{
					path: "",
					redirect: "/mcs",
				},
				{
					path: "mcs",
					name: "user-mc-list",
					component: () => import("@/views/user/McList.vue"),
				},
				{
					path: "mcs/:id",
					name: "uc-mc",
					component: () => import("@/views/user/Mc.vue"),
				},
				{
					path: "profiles/:id/:tabIndex?",
					name: "user-profile",
					component: () => import("@/views/user/Mc.vue"),
				},
				{
					path: "posts",
					name: "user-post-list",
					component: () => import("@/views/user/PostList.vue"),
				},
				{
					path: "messages",
					name: "user-message-list",
					component: () => import("@/views/user/MessageList.vue"),
				},
				{
					path: "notifications",
					name: "user-notification-list",
					component: () => import("@/views/user/NotificationList.vue"),
				},
				{
					path: "setting",
					name: "user-setting",
					component: () => import("@/views/user/Setting.vue"),
				},
				{
					path: "offer-detail/:id",
					name: "user-offer-detail",
					component: () => import("@/views/user/OfferDetail.vue"),
					props: true,
				},
				{
					path: "contracts",
					name: "user-contract-list",
					component: () => import("@/views/user/ContractList.vue"),
				},
				{
					path: "user-identity-verification",
					name: "user-identity-verification",
					component: () => import("@/views/IdentityVerification/IdentityVerificationView.vue"),
				},
				{
					path: "review/:contractId/:notificationId",
					name: "user-review",
					component: () => import("@/views/user/Review.vue"),
				},
				{
					path: "contracts/:id",
					name: "user-contract-detail",
					component: () => import("@/views/user/ContractDetail.vue"),
				},
				{
					path: "choose-user-type",
					name: "user-choose-type",
					component: () => import("@/views/user/ChooseUserType.vue"),
				},
				{
					path: "/login",
					name: "user-login",
					component: () => import("@/views/user/Login.vue"),
				},
			],
		},
		{
			path: "/:catchAll(.*)",
			redirect: "/",
		},
	],
});

// Setup admin route guard
setupAdminRouteGuard(router);

export default router;
