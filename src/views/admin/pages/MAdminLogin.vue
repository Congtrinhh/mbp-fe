<!-- MAdminLogin.vue -->
<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
			<div class="text-center mb-8">
				<img src="@/assets/logo.png" alt="MBP Logo" class="h-12 mx-auto mb-4" />
				<h1 class="text-2xl font-semibold">Admin Login</h1>
			</div>

			<form @submit.prevent="handleLogin" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">Username</label>
					<InputText v-model="username" class="w-full" :class="{ 'p-invalid': submitted && !username }" />
					<small v-if="submitted && !username" class="p-error">Username is required</small>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700">Password</label>
					<Password
						v-model="password"
						:feedback="false"
						toggleMask
						class="w-full"
						:class="{ 'p-invalid': submitted && !password }"
					/>
					<small v-if="submitted && !password" class="p-error">Password is required</small>
				</div>

				<Button type="submit" label="Login" class="w-full" :loading="loading" />
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuth } from "@/composables/admin/useAdminAuth";

//#region State & Dependencies
const router = useRouter();
const { setAdminToken } = useAdminAuth();

const username = ref("");
const password = ref("");
const submitted = ref(false);
const loading = ref(false);
//#endregion

//#region Form Validation
const validateForm = (): boolean => {
	submitted.value = true;
	return !!(username.value && password.value);
};
//#endregion

//#region Authentication Handlers
const handleLogin = async () => {
	if (!validateForm()) {
		return;
	}

	loading.value = true;

	try {
		// During development, allow empty credentials for successful login
		// TODO: Implement actual login API call
		setAdminToken("development_token");
		router.push("/admin");
	} catch (error) {
		console.error("Login failed:", error);
	} finally {
		loading.value = false;
	}
};
//#endregion
</script>

<style scoped>
:deep(.p-password-input) {
	width: 100%;
}
</style>
