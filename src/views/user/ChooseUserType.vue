<!--
* ChooseUserType.vue
*
* User type selection during registration process.
* Allows users to specify their role in the system:
* - MC (with experience level selection)
* - Guest booking MC
*
* Features:
* - Dynamic form based on user selection
* - Google auth integration
* - Loading state handling
* - Success/error notifications
* - Navigation management
*
* created by tqcong 20/5/2025.
-->
<template>
	<main class="main-container background-1">
		<h1 class="title">Bạn là ai?</h1>
		<div class="radio-group">
			<div class="radio-item">
				<RadioButton size="large" inputId="mc" v-model="isMc" :value="true" />
				<label for="mc">MC</label>
			</div>
			<div v-if="isMc" class="sub-options">
				<div class="radio-item">
					<RadioButton size="large" inputId="experienced" v-model="isNewbie" :value="false" />
					<label for="experienced">MC có kinh nghiệm</label>
				</div>
				<div class="radio-item">
					<RadioButton size="large" inputId="newbie" v-model="isNewbie" :value="true" />
					<label for="newbie">MC mới</label>
				</div>
			</div>
			<div class="radio-item">
				<RadioButton size="large" inputId="guest" v-model="isMc" :value="false" />
				<label for="guest">Khách booking MC</label>
			</div>
		</div>

		<div class="button-group">
			<Button @click="goBack" severity="secondary">Quay lại</Button>
			<Button @click="submitUserType" severity="contrast">Tiếp tục</Button>
		</div>
	</main>
</template>

<script setup lang="ts">
/**
 * User Type Selection Component Script
 *
 * Handles user type selection and registration completion:
 * - Google credential validation
 * - User type and experience selection
 * - Account creation with selected preferences
 * - Navigation and notification management
 *
 * created by tqcong 20/5/2025.
 */

import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { authApi } from "@/apis/authApi";
import { useAuthStore } from "@/stores/authStore";
import { hideLoading, showLoading } from "@/composables/useLoading";

/**
 * Component state and dependencies
 * created by tqcong 20/5/2025.
 */
const route = useRoute();
const router = useRouter();
const toast = useToast();

/**
 * User type selection state
 * created by tqcong 20/5/2025.
 */
const isMc = ref(true);
const isNewbie = ref<boolean>(false);
const credential = route.query.credential as string;

/**
 * Navigation handler to return to login page
 * created by tqcong 20/5/2025.
 */
const goBack = () => {
	router.push({ name: "user-login" });
};

/**
 * Submits user type selection and completes registration
 * - Validates Google credential
 * - Creates user account with selected type
 * - Handles success/error notifications
 * - Manages loading state
 * - Navigates to post list on success
 *
 * created by tqcong 20/5/2025.
 */
const submitUserType = async () => {
	if (!credential) {
		toast.add({ severity: "error", summary: "Lỗi", detail: "Thiếu thông tin xác thực", life: 3000 });
		return;
	}

	try {
		showLoading();

		const response = await authApi.loginWithGoogle(credential, true, isMc.value, isNewbie.value);
		if (response.data.accessToken) {
			const authStore = useAuthStore();
			authStore.login(response.data.accessToken);
			toast.add({
				severity: "success",
				summary: "Thành công",
				detail: "Tài khoản đã được tạo thành công",
				life: 3000,
			});
			router.push({ name: "user-post-list" });
		} else {
			toast.add({
				severity: "error",
				summary: "Lỗi",
				detail: "Tạo tài khoản thất bại",
				life: 3000,
			});
		}
	} catch (error) {
		console.error(error);
	} finally {
		hideLoading();
	}
};
</script>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	padding: 24px;
	padding-top: 34vh;
}
.title {
	text-align: center;
	font-size: 2rem;
	margin-bottom: 54px;
	font-weight: 700;
}
.info {
	text-align: center;
	margin-bottom: 24px;
}
.radio-group {
	display: flex;
	flex-direction: column;
	gap: 16px;
	flex-grow: 1;
	justify-content: flex-start;
	margin-left: 70px;
}
.radio-item {
	display: flex;
	align-items: center;
	gap: 8px;
}
.button-group {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
	margin-bottom: 30px;
}
.newbie-section {
	margin-top: 24px;
	margin-left: 70px;
}
.newbie-title {
	font-size: 1.2rem;
	margin-bottom: 16px;
}

.sub-options {
	padding-left: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

label {
	font-size: 1.05rem;
	font-weight: 600;
}
</style>
