<template>
	<div class="min-h-screen bg-slate-50">
		<!-- Header (56px height, full width) -->
		<MAdminHeader
			class="fixed top-0 left-0 right-0 z-50"
			:collapsed="sidebarCollapsed"
			@toggle-sidebar="toggleSidebar"
		/>

		<div class="flex pt-[56px]">
			<!-- Sidebar (280px width) -->
			<MSidebar
				:collapsed="sidebarCollapsed"
				class="fixed left-0 h-[calc(100vh-56px)] z-40 transition-transform duration-300"
				:class="[sidebarCollapsed ? '-translate-x-[280px]' : 'translate-x-0']"
			/>

			<!-- Main Content Area (remaining space) -->
			<main
				class="transition-all duration-300 min-h-[calc(100vh-56px)] overflow-auto"
				:class="[sidebarCollapsed ? 'ml-0' : 'ml-[280px]']"
			>
				<div class="admin-main-content-container">
					<router-view v-slot="{ Component }">
						<Suspense>
							<component :is="Component" />
							<template #fallback>
								<div class="flex items-center justify-center py-8">
									<ProgressSpinner />
								</div>
							</template>
						</Suspense>
					</router-view>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuth } from "@/composables/admin/useAdminAuth";
import MSidebar from "@/components/MSidebar.vue";
import MAdminHeader from "@/views/admin/layout/MAdminHeader.vue";
import ProgressSpinner from "primevue/progressspinner";

const router = useRouter();
const { validateAdminToken } = useAdminAuth();
const sidebarCollapsed = ref(window.innerWidth < 768);

const toggleSidebar = () => {
	sidebarCollapsed.value = !sidebarCollapsed.value;
};

// Handle responsive behavior
const handleResize = () => {
	if (window.innerWidth < 768) {
		sidebarCollapsed.value = true;
	}
};

onMounted(async () => {
	const isAuthenticated = await validateAdminToken();
	if (!isAuthenticated) {
		router.push("/admin/login");
	}

	window.addEventListener("resize", handleResize);
});
</script>

<style scoped>
:deep(.p-progressspinner) {
	width: 50px;
	height: 50px;
}

.admin-main-content-container {
	display: flex;
	flex-direction: column;
	padding: 16px;
	height: 100%;
}
</style>
