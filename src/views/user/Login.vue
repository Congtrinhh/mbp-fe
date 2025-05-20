<template>
	<main class="main-container background-1">
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

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
	const { credential } = response;
	// Decode the JWT token
	const decodedToken = jwtDecode(credential);

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

		toast.add({
			severity: "success",
			summary: "Đăng nhập thành công",
			detail: "Bạn đã đăng nhập thành công",
			life: 3000,
		});

		// Redirect to the original view
		const redirectPath = route.query.redirect || "/";
		router.push(redirectPath as string);
	}
};

// handle an error event
const handleLoginError = () => {
	toast.add({
		severity: "error",
		summary: "Đăng nhập thất bại",
		detail: "Không thể đăng nhập",
		life: 3000,
	});
};
</script>
<style scoped lang="scss">
.main-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}
</style>
