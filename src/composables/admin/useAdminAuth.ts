import { ref } from "vue";

export function useAdminAuth() {
	const ADMIN_TOKEN_KEY = "mbp_admin_token";

	const isAuthenticated = ref(false);

	const checkAdminToken = (): boolean => {
		const token = localStorage.getItem(ADMIN_TOKEN_KEY);
		isAuthenticated.value = !!token;
		return isAuthenticated.value;
	};

	const validateAdminToken = async (): Promise<boolean> => {
		// TODO: Implement backend validation
		// During development, just check if token exists
		return checkAdminToken();
	};

	const setAdminToken = (token: string): void => {
		localStorage.setItem(ADMIN_TOKEN_KEY, token);
		isAuthenticated.value = true;
	};

	const clearAdminToken = (): void => {
		localStorage.removeItem(ADMIN_TOKEN_KEY);
		isAuthenticated.value = false;
	};

	return {
		isAuthenticated,
		checkAdminToken,
		validateAdminToken,
		setAdminToken,
		clearAdminToken,
	};
}
