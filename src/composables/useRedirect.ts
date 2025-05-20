import { useRouter } from "vue-router";

export function useRedirect() {
	const router = useRouter();

	const redirectToProfile = (id: number | undefined) => {
		if (id) {
			router.push({ name: "user-profile", params: { id } });
		}
	};

	return {
		redirectToProfile,
	};
}
