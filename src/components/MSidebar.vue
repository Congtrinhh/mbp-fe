<!-- MSidebar.vue -->
<template>
	<aside class="w-[280px] bg-white border-r overflow-y-auto">
		<!-- Navigation Menu -->
		<nav class="py-2">
			<PanelMenu :model="menuItems" class="border-none" :multiple="true" />
		</nav>
	</aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { MenuItem } from "primevue/menuitem";

defineProps<{
	collapsed: boolean;
}>();

const router = useRouter();
const route = useRoute();

const isActive = (path: string) => {
	return route.path === path;
};

const handleNavigation = (path: string) => {
	router.push(path);
};

const menuItems = ref<MenuItem[]>([
	{
		label: "MCs and Clients",
		icon: "pi pi-users",
		command: () => handleNavigation("/admin/mc"),
		class: computed(() => (isActive("/admin/mc") ? "active-item" : "")),
	},
	{
		label: "Posts",
		icon: "pi pi-file",
		command: () => handleNavigation("/admin/post"),
		class: computed(() => (isActive("/admin/post") ? "active-item" : "")),
	},
	{
		label: "Categories",
		icon: "pi pi-tags",
		items: [
			{
				label: "MC Types",
				icon: "pi pi-tag",
				command: () => handleNavigation("/admin/category/mc-type"),
				class: computed(() => (isActive("/admin/category/mc-type") ? "active-item" : "")),
			},
			{
				label: "Hosting Styles",
				icon: "pi pi-tag",
				command: () => handleNavigation("/admin/category/hosting-style"),
				class: computed(() => (isActive("/admin/category/hosting-style") ? "active-item" : "")),
			},
		],
	},
	{
		label: "Role Management",
		icon: "pi pi-users",
		items: [
			{
				label: "Employees",
				icon: "pi pi-user",
				command: () => handleNavigation("/admin/role-management/employee"),
				class: computed(() => (isActive("/admin/role-management/employee") ? "active-item" : "")),
			},
			{
				label: "Roles",
				icon: "pi pi-id-card",
				command: () => handleNavigation("/admin/role-management/role"),
				class: computed(() => (isActive("/admin/role-management/role") ? "active-item" : "")),
			},
		],
	},
	{
		label: "System",
		icon: "pi pi-cog",
		items: [
			{
				label: "Activity Logs",
				icon: "pi pi-history",
				command: () => handleNavigation("/admin/system/activity-log"),
				class: computed(() => (isActive("/admin/system/activity-log") ? "active-item" : "")),
			},
		],
	},
]);
</script>

<style scoped>
:deep(.p-panelmenu) {
	@apply border-none;
}

:deep(.p-panelmenu-header-link) {
	@apply px-5 py-3 hover:bg-slate-50;
}

:deep(.p-menuitem-icon) {
	@apply mr-3;
}

:deep(.p-menuitem-link) {
	@apply px-5 py-2 hover:bg-slate-50;
}

:deep(.p-panelmenu-content) {
	@apply border-none;
}

:deep(.p-submenu-list) {
	@apply bg-white;
}

:deep(.p-submenu-list .p-menuitem-link) {
	@apply pl-10;
}

:deep(.p-panelmenu .p-panelmenu-header > a) {
	@apply border-none;
}

:deep(.p-panelmenu .p-panelmenu-content) {
	@apply border-none;
}

:deep(.active-item) {
	@apply text-blue-600 font-medium;
}

:deep(.active-item .p-menuitem-icon),
:deep(.active-item .p-menuitem-text) {
	@apply text-blue-600;
}

:deep(.p-submenu-list .active-item) {
	@apply bg-blue-50;
}

:deep(.p-menuitem.active-item > .p-menuitem-content > .p-menuitem-link) {
	@apply bg-blue-50;
}
</style>
