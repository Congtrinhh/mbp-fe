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

		<!-- User Type Selection Form -->
		<div class="radio-group">
			<div class="radio-item">
				<RadioButton size="large" inputId="mc" v-model="isMc" :value="true" />
				<label for="mc">MC</label>
			</div>

			<!-- MC Experience Level Selection -->
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

		<!-- Navigation Buttons -->
		<div class="button-group">
			<Button @click="goBack" severity="secondary">Quay lại</Button>
			<Button @click="submitUserType" severity="contrast">Tiếp tục</Button>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

// API & Store imports
import { authApi } from "@/apis/authApi";
import { useAuthStore } from "@/stores/authStore";
import { hideLoading, showLoading } from "@/composables/useLoading";

//#region State & Dependencies
const route = useRoute();
const router = useRouter();
const toast = useToast();

const isMc = ref(true);
const isNewbie = ref<boolean>(false);
const credential = route.query.credential as string;
//#endregion

//#region Navigation Handlers
const goBack = () => {
	router.push({ name: "user-login" });
};

const navigateToPostList = () => {
	router.push({ name: "user-post-list" });
};
//#endregion

//#region Form Submission
const submitUserType = async () => {
	if (!validateCredential()) return;

	try {
		showLoading();
		await handleAccountCreation();
	} catch (error) {
		console.error(error);
		showErrorToast("Tạo tài khoản thất bại");
	} finally {
		hideLoading();
	}
};

const validateCredential = (): boolean => {
	if (!credential) {
		showErrorToast("Thiếu thông tin xác thực");
		return false;
	}
	return true;
};

const handleAccountCreation = async () => {
	const response = await authApi.loginWithGoogle(credential, true, isMc.value, isNewbie.value);

	if (response.data.accessToken) {
		const authStore = useAuthStore();
		authStore.login(response.data.accessToken);
		showSuccessToast();
		navigateToPostList();
	} else {
		showErrorToast("Tạo tài khoản thất bại");
	}
};
//#endregion

//#region Notifications
const showSuccessToast = () => {
	toast.add({
		severity: "success",
		summary: "Thành công",
		detail: "Tài khoản đã được tạo thành công",
		life: 3000,
	});
};

const showErrorToast = (message: string) => {
	toast.add({
		severity: "error",
		summary: "Lỗi",
		detail: message,
		life: 3000,
	});
};
//#endregion
</script>

<style scoped lang="scss">
.main-container {
	display: flex;
	flex-direction: column;
	padding: 24px;
	padding-top: 34vh;

	.title {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 54px;
		font-weight: 700;
	}
}

.radio-group {
	display: flex;
	flex-direction: column;
	gap: 16px;
	flex-grow: 1;
	justify-content: flex-start;
	margin-left: 70px;

	.radio-item {
		display: flex;
		align-items: center;
		gap: 8px;

		label {
			font-size: 1.05rem;
			font-weight: 600;
		}
	}

	.sub-options {
		padding-left: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
}

.button-group {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
	margin-bottom: 30px;
}
</style>
