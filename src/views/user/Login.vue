<!--
* Login.vue
*
* Login view component with Google authentication.
* Handles user authentication flow including:
* - Google Sign-In integration
* - Email verification check
* - New user registration flow
* - Existing user login
* - Return URL handling
*
* Features:
* - Single Sign-On with Google
* - JWT token handling
* - Conditional navigation
* - Toast notifications
* - Responsive design
*
* created by tqcong 20/5/2025.
-->
<template>
	<main class="main-container background-1">
		<h1 class="title">Chào mừng bạn đến với nền tảng booking MC - MBP</h1>
		<p class="subtitle">Vui lòng dùng tài khoản Google để đăng nhập/ đăng ký</p>
		<div class="login-with-google-wrapper">
			<GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
		</div>
	</main>
</template>

<script setup lang="ts">
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/apis/authApi";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";

//#region Types and Interfaces
interface GoogleTokenPayload {
	email: string;
	name: string;
	picture: string;
	email_verified: boolean;
}
//#endregion

//#region Store and Service Initialization
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
//#endregion

//#region Authentication Handlers
const handleLoginSuccess = async (response: CredentialResponse) => {
	const { credential } = response;
	if (!credential) {
		console.error("No credential received");
		return;
	}

	// Decode the JWT token with type
	const decodedToken = jwtDecode<GoogleTokenPayload>(credential);

	// Extract user information from the decoded token
	const { email, name, picture, email_verified } = decodedToken;
	console.log("User Info:", { email, name, picture, email_verified });

	if (!email_verified) {
		console.log("Vui lòng xác thực email trước khi đăng nhập");
		return;
	}

	const createUserResponse = await authApi.loginWithGoogle(credential, false, false);

	if (createUserResponse.data.isNewUser === true) {
		// Redirect to the choose user type screen and pass credential
		router.push({ name: "user-choose-type", query: { credential } });
	} else {
		authStore.login(createUserResponse.data.accessToken);
		showSuccessToast();
		handleRedirect();
	}
};

const handleLoginError = () => {
	toast.add({
		severity: "error",
		summary: "Đăng nhập thất bại",
		detail: "Không thể đăng nhập",
		life: 3000,
	});
};
//#endregion

//#region Helper Functions
const showSuccessToast = () => {
	toast.add({
		severity: "success",
		summary: "Đăng nhập thành công",
		detail: "Bạn đã đăng nhập thành công",
		life: 3000,
	});
};

const handleRedirect = () => {
	const redirectPath = route.query.redirect || "/";
	router.push(redirectPath as string);
};
//#endregion
</script>

<style scoped lang="scss">
.main-container {
	display: flex;
	align-items: center;
	height: 100vh;
	flex-direction: column;
	padding: 0 24px;

	.title {
		font-size: 2.5rem;
		font-weight: bold;
		margin-top: 100px;
		text-align: center;
	}

	.subtitle {
		font-size: 1.2rem;
		margin-top: 20px;
		text-align: center;
		font-weight: 500;
		color: #000;
	}

	.login-with-google-wrapper {
		margin-top: 32px;
	}
}
</style>
