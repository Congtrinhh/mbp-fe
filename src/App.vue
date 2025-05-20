<script setup lang="ts">
import { useLoading } from "@/composables/useLoading"; // Update import path
import { useAuthStore } from "@/stores/authStore"; // Add this import
import { onUnmounted } from "vue";
const { isLoading } = useLoading();

onUnmounted(() => {
	const authStore = useAuthStore();
	authStore.stopSignalRConnection();
});
</script>

<template>
	<Toast />
	<router-view />
	<div v-if="isLoading" class="loading-overlay">
		<span class="loader"></span>
	</div>
</template>

<style scoped>
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

/* music bar loader */
.loader {
	width: 6px; /* 8px * 3/4 */
	height: 30px; /* 40px * 3/4 */
	border-radius: 3px; /* 4px * 3/4 */
	display: block;
	margin: 20px auto;
	position: relative;
	background: currentColor;
	color: #000;
	box-sizing: border-box;
	animation: animloader 0.3s 0.3s linear infinite alternate;
}

.loader::after,
.loader::before {
	content: "";
	width: 6px; /* 8px * 3/4 */
	height: 30px; /* 40px * 3/4 */
	border-radius: 3px; /* 4px * 3/4 */
	background: currentColor;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 15px; /* 20px * 3/4 */
	box-sizing: border-box;
	animation: animloader 0.3s 0.45s linear infinite alternate;
}
.loader::before {
	left: -15px; /* -20px * 3/4 */
	animation-delay: 0s;
}

@keyframes animloader {
	0% {
		height: 36px; /* 48px * 3/4 */
	}
	100% {
		height: 3px; /* 4px * 3/4 */
	}
}

/* tiktok loader */
/* .loader {
	width: 32px;
	height: 24px;
	position: relative;
	animation: split-7a7a37b1 1s ease-in infinite alternate;
}
.loader::before,
.loader::after {
	content: "";
	position: absolute;
	height: 24px;
	width: 24px;
	border-radius: 50%;
	left: 0;
	top: 0;
	transform: translateX(-5px);
	background: #ff3d00;
	opacity: 0.75;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
}

.loader::after {
	left: auto;
	right: 0;
	background: #333;
	transform: translateX(5px);
}

@keyframes split {
	0%,
	25% {
		width: 32px;
	}
	100% {
		width: 74px;
	}
} */
</style>
