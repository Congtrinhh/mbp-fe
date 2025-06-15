<!--
* Setting.vue
*
* User settings and account management view component.
* Provides functionality for:
* - Account profile access
* - Contract management
* - Identity verification
* - User authentication (login/logout)
*
* Features:
* - Conditional rendering based on auth state
* - Navigation to user-related features
* - Profile image display
* - Toast notifications
*
* created by tqcong 20/5/2025.
-->
<template>
	<main class="main-container">
		<header class="center-header">Thiết lập</header>

		<!-- User Profile Section -->
		<div class="account-wrapper" v-if="isLoggedIn" @click="redirectToProfile(user?.id)">
			<div class="avatar img-parent">
				<img :src="user?.avatarUrl" alt="avatar" />
			</div>
			<div class="name">{{ user?.isMc === true ? user?.nickName : user?.fullName }}</div>
		</div>
		<div class="login-button" v-else>
			<button @click="redirectToLogin">Đăng nhập</button>
		</div>

		<!-- Settings Options -->
		<div class="option-list" v-if="isLoggedIn">
			<div class="option-item" @click="redirectToContracts">
				<div class="icon pi pi-book"></div>
				<div class="text">Hợp đồng</div>
			</div>
			<div class="option-item" @click="redirectToIdVerification">
				<div class="icon pi pi-lock-open"></div>
				<div class="text">Xác minh danh tính</div>
			</div>
			<div class="option-item log-out-button" @click="logout">
				<div class="icon pi pi-sign-out"></div>
				<div class="text">Đăng xuất</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

// Store & Composables
import { useAuthStore } from "@/stores/authStore";
import { useRedirect } from "@/composables/useRedirect";

//#region State & Store Management
const router = useRouter();
const authStore = useAuthStore();
const { redirectToProfile } = useRedirect();
const toast = useToast();

// Reactive References
const { user } = storeToRefs(authStore);
const isLoggedIn = computed(() => !!user.value);
//#endregion

//#region Navigation Handlers
const redirectToLogin = () => {
	router.push({ name: "user-login" });
};

const redirectToContracts = () => {
	router.push({ name: "user-contract-list" });
};

const redirectToIdVerification = () => {
	router.push({ name: "user-identity-verification" });
};
//#endregion

//#region Authentication Handlers
/**
 * Handles user logout
 * - Calls auth store logout method
 * - Redirects to post list
 * - Shows success notification
 * created by tqcong 20/5/2025.
 */
const logout = async () => {
	await authStore.logout();
	router.push({ name: "user-post-list" });
	showLogoutNotification();
};

const showLogoutNotification = () => {
	toast.add({
		severity: "success",
		summary: "Đã đăng xuất",
		detail: "Bạn đã đăng xuất khỏi hệ thống",
		life: 3000,
	});
};
//#endregion
</script>

<style lang="scss" scoped>
.main-container {
	background-color: #e8e8e8;
	display: flex;
	flex-direction: column;
}

.account-wrapper {
	display: flex;
	gap: 16px;
	padding: 16px 24px;
	background: #fff;
	margin-bottom: 8px;
	align-items: center;

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
	}
}

.login-button {
	display: flex;
	justify-content: center;
	padding: 16px 24px;
	background: #fff;
	margin-bottom: 12px;
}

.option-list {
	background: #fff;
	display: flex;
	flex-direction: column;
	padding-top: 16px;
	flex: 1;

	.option-item {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 12px 24px;
		cursor: pointer;
		background: #fff;
		transition: background-color 0.2s ease;

		&:hover {
			background: #f5f5f5;
		}

		&:focus {
			background: #333;
		}

		.icon {
			font-size: 1.2rem;
		}
	}
}
</style>
