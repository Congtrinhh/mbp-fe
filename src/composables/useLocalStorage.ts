import { ref } from "vue";

export function useLocalStorage() {
	const prefix = "mbp";
	const getItem = (key: string) => {
		const finalKey = `${prefix}_${key}`;
		const item = localStorage.getItem(finalKey);
		return item ? JSON.parse(item) : null;
	};

	const setItem = (key: string, value: any) => {
		const finalKey = `${prefix}_${key}`;
		localStorage.setItem(finalKey, JSON.stringify(value));
	};

	const removeItem = (key: string) => {
		const finalKey = `${prefix}_${key}`;
		localStorage.removeItem(finalKey);
	};

	const clear = () => {
		localStorage.clear();
	};

	return {
		getItem,
		setItem,
		removeItem,
		clear,
	};
}
