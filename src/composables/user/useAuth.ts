import { ref } from "vue";
import axios from "axios";

const user = ref(null);

export function useAuth() {
	const loginWithGoogle = async (googleUser: any) => {
		try {
			const idToken = googleUser.getAuthResponse().id_token;

			// Send the ID token to your backend to get a JWT
			const response = await axios.post("/api/auth/google", { idToken });
			const jwtToken = response.data.token;

			// Store the JWT token in local storage
			localStorage.setItem("jwtToken", jwtToken);

			user.value = googleUser.getBasicProfile();
		} catch (error) {
			console.error("Error logging in with Google: ", error);
		}
	};

	const logout = () => {
		localStorage.removeItem("jwtToken");
		user.value = null;
	};

	return {
		user,
		loginWithGoogle,
		logout,
	};
}
