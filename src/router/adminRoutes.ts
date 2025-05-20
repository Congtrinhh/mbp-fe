// import { RouteRecordRaw } from "vue-router";
import AdminLayout from "@/views/admin/layout/AdminLayout.vue";
import { useAdminAuth } from "@/composables/admin/useAdminAuth";
export const adminRoutes: any[] = [
	{
		path: "/admin/login",
		name: "admin-login",
		component: () => import("@/views/admin/pages/MAdminLogin.vue"),
	},
	{
		path: "/admin",
		component: AdminLayout,
		children: [
			{
				path: "",
				name: "admin-dashboard",
				component: () => import("@/views/admin/pages/McManagement.vue"),
			},
			{
				path: "mc",
				name: "admin-mc",
				component: () => import("@/views/admin/pages/McManagement.vue"),
			},
			{
				path: "post",
				name: "admin-post",
				component: () => import("@/views/admin/pages/PostManagement.vue"),
			},
			{
				path: "category/mc-type",
				name: "admin-mc-type",
				component: () => import("@/views/admin/pages/category/McTypeManagement.vue"),
			},
			{
				path: "category/hosting-style",
				name: "admin-hosting-style",
				component: () => import("@/views/admin/pages/category/HostingStyleManagement.vue"),
			},
			{
				path: "role-management/employee",
				name: "admin-employee",
				component: () => import("@/views/admin/pages/role-management/EmployeeManagement.vue"),
			},
			{
				path: "role-management/role",
				name: "admin-role",
				component: () => import("@/views/admin/pages/role-management/RoleManagement.vue"),
			},
			{
				path: "system/activity-log",
				name: "admin-activity-log",
				component: () => import("@/views/admin/pages/system/ActivityLogManagement.vue"),
			},
		],
	},
];

// Navigation guard for admin routes
export const setupAdminRouteGuard = (router: any) => {
	router.beforeEach(async (to: any, from: any, next: any) => {
		if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
			const { validateAdminToken } = useAdminAuth();
			const isAuthenticated = await validateAdminToken();

			if (!isAuthenticated) {
				next("/admin/login");
				return;
			}
		}
		next();
	});
};
