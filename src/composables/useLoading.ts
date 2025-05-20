import { ref } from "vue";

const isLoading = ref(false);

export const showLoading = () => {
	isLoading.value = true;
};

export const hideLoading = () => {
	isLoading.value = false;
};

export const useLoading = () => {
	return { isLoading };
};
