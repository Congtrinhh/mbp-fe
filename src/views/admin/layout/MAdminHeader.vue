<!-- MAdminHeader.vue -->
<template>
	<header class="h-[56px] bg-white border-b flex items-center px-4">
		<div class="flex items-center gap-4">
			<!-- Collapse Toggle -->
			<button @click="$emit('toggle-sidebar')" class="p-2 rounded-lg hover:bg-slate-50">
				<i class="pi pi-bars text-lg"></i>
			</button>

			<!-- MBP Logo -->
			<img src="@/assets/logo.svg" alt="MBP Logo" class="h-6" />
		</div>

		<div class="flex-1"></div>

		<!-- Account Menu -->
		<Menu ref="menu" :model="accountItems" :popup="true" class="w-[200px]">
			<template #item="{ item }">
				<div class="flex items-center">
					<i :class="[item.icon, 'mr-3']"></i>
					<span>{{ item.label }}</span>
				</div>
			</template>
		</Menu>

		<button
			@click="(event) => menu.toggle(event)"
			class="flex items-center space-x-2 hover:bg-slate-50 rounded-lg p-2"
		>
			<i class="pi pi-user text-xl"></i>
			<i class="pi pi-angle-down"></i>
		</button>
	</header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuth } from "@/composables/admin/useAdminAuth";
import type { MenuItem } from "primevue/menuitem";
import Menu from "primevue/menu";

defineProps<{
	collapsed: boolean;
}>();

defineEmits<{
	(e: "toggle-sidebar"): void;
}>();

const router = useRouter();
const menu = ref();
const { clearAdminToken } = useAdminAuth();

const handleLogout = () => {
	clearAdminToken();
	router.push("/admin/login");
};

const accountItems = ref<MenuItem[]>([
	{
		label: "Account Information",
		icon: "pi pi-user",
		command: () => router.push("/admin/account"),
	},
	{
		label: "Change Password",
		icon: "pi pi-lock",
		command: () => router.push("/admin/change-password"),
	},
	{
		separator: true,
	},
	{
		label: "Logout",
		icon: "pi pi-power-off",
		command: handleLogout,
	},
]);
</script>

<style scoped>
:deep(.p-menu) {
	min-width: 200px;
}

:deep(.p-menu-list) {
	@apply py-2;
}

:deep(.p-menuitem) {
	@apply mb-1 last:mb-0;
}

:deep(.p-menuitem-link) {
	@apply px-4 py-2 hover:bg-slate-50;
}
</style>
