<template>
	<div class="navbar" id="navbar">
		<template v-for="item in items">
			<router-link
				v-if="item.shouldShow()"
				:key="item.name"
				class="nav-item"
				@click="handleTabClick(item)"
				:class="{ active: item.route === currentRoute.path }"
				:to="item.route"
			>
				<i :class="item.icon"></i>
				<div v-if="item.label" class="label">{{ item.label }}</div>
				<div
					v-if="item.name == 'notifications' && unreadNotificationCount > 0"
					class="unread-notification-count-wrapper"
				>
					<div class="unread-notification-count">
						{{ unreadNotificationCount > 9 ? "9+" : unreadNotificationCount }}
					</div>
				</div>
			</router-link>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Store imports
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

//#region Types & Interfaces
interface NavItem {
	name: string;
	route: string;
	label: string;
	icon: string;
	shouldShow: () => boolean;
	active?: boolean;
}
//#endregion

//#region Store & State
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const currentRoute = ref(route);
const unreadNotificationCount = computed(() => appStore.unreadNotificationCount);

const items = ref<NavItem[]>([
	{
		name: "posts",
		route: "/posts",
		label: "",
		icon: "pi pi-home",
		shouldShow: () => true,
	},
	// {
	//   name: "messages",
	//   route: "/messages",
	//   label: "",
	//   icon: "pi pi-comment",
	//   shouldShow: () => authStore.user!!
	// },
	{
		name: "mcs",
		route: "/mcs",
		label: "MC",
		shouldShow: () => true,
	},
	{
		name: "notifications",
		route: "/notifications",
		label: "",
		icon: "pi pi-bell",
		shouldShow: () => authStore.user!!,
	},
	{
		name: "setting",
		route: "/setting",
		label: "",
		icon: "pi pi-bars",
		shouldShow: () => true,
	},
]);
//#endregion

//#region Navigation & Route Handling
const handleTabClick = (item: NavItem) => {
	items.value.forEach((i) => (i.active = false));
	item.active = true;
	router.push(item.route);
};

watch(route, (newRoute) => {
	currentRoute.value = newRoute;
});
//#endregion
</script>

<style lang="scss" scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	padding: 12px 24px;
	border-top: 1px solid #c1c1c1;
	gap: 8px;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;
	height: 60px;
	background: #fff;

	.nav-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		position: relative;
		transition: background-color 0.2s ease;

		i.pi {
			font-size: 1.5rem;
			color: #000;
		}

		.label {
			font-weight: bold;
			color: #000;
			font-size: 1.2rem;
		}

		&.active {
			background: #000;

			i.pi {
				color: #fff;
			}

			.label {
				color: #fff;
			}

			.unread-notification-count-wrapper {
				background: #fff;
				color: #333;
			}
		}

		&:hover:not(.active) {
			background-color: #f5f5f5;
		}
	}
}

.unread-notification-count-wrapper {
	position: absolute;
	top: 0px;
	left: 50%;
	transform: translateX(calc(-50% + 11px));
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	width: 18px;
	height: 18px;
	background: #333;
	color: #fff;
	font-size: 0.85rem;

	.unread-notification-count {
		font-weight: 600;
		width: 10px;
		text-align: center;
	}
}
</style>
