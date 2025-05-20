<template>
	<div class="id-card-capture-step">
		<h2 class="text-xl font-semibold mb-4 text-center">
			Chụp ảnh {{ side === "front" ? "mặt trước" : "mặt sau" }} CCCD
		</h2>

		<!-- Camera View -->
		<div class="camera-container mb-4 relative">
			<video
				v-if="!capturedImage"
				ref="videoElement"
				class="w-full h-64 object-cover rounded-lg"
				autoplay
				playsinline
			></video>
			<img
				v-else
				:src="capturedImage"
				class="w-full h-64 object-cover rounded-lg"
				:alt="`ID Card ${side} side`"
			/>

			<!-- Capture Guidelines -->
			<div v-if="!capturedImage" class="card-guidelines">
				<div class="guideline-box"></div>
				<p class="text-sm text-white text-center mt-2">
					Đặt {{ side === "front" ? "mặt trước" : "mặt sau" }} CCCD vào khung hình
				</p>
			</div>
		</div>

		<!-- Controls -->
		<div class="controls flex justify-between">
			<Button @click="$emit('back')" severity="secondary" label="Quay lại" />

			<Button v-if="!capturedImage" @click="capturePhoto" severity="primary" label="Chụp ảnh" />

			<div v-else class="flex gap-2">
				<Button @click="retakePhoto" severity="secondary" label="Chụp lại" />
				<Button @click="confirmPhoto" severity="primary" label="Tiếp tục" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";

const props = defineProps<{
	side: "front" | "back";
}>();

const emit = defineEmits<{
	(e: "photo-captured", data: string): void;
	(e: "back"): void;
}>();

const toast = useToast();
const videoElement = ref<HTMLVideoElement | null>(null);
const capturedImage = ref<string | null>(null);
let stream: MediaStream | null = null;

const loadDefaultImage = async () => {
	try {
		const imagePath =
			props.side === "front"
				? "/features/id-verification/docs/img/id-front.jpg"
				: "/features/id-verification/docs/img/id-back.jpg";

		const response = await fetch(imagePath);
		const blob = await response.blob();
		const reader = new FileReader();
		reader.onloadend = () => {
			capturedImage.value = reader.result as string;
		};
		reader.readAsDataURL(blob);
	} catch (error) {
		console.error("Error loading default image:", error);
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Không thể tải ảnh mặc định",
			life: 3000,
		});
	}
};

const startCamera = async () => {
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: "environment",
				width: { ideal: 1920 },
				height: { ideal: 1080 },
			},
		});

		if (videoElement.value) {
			videoElement.value.srcObject = stream;
		}
	} catch (error) {
		console.error("Error accessing camera:", error);
		toast.add({
			severity: "error",
			summary: "Lỗi Camera",
			detail: "Không thể truy cập camera. Đang sử dụng ảnh mặc định...",
			life: 5000,
		});
		await loadDefaultImage();
	}
};

const stopCamera = () => {
	if (stream) {
		stream.getTracks().forEach((track) => track.stop());
		stream = null;
	}
	if (videoElement.value) {
		videoElement.value.srcObject = null;
	}
};

const capturePhoto = () => {
	if (!videoElement.value) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Không thể chụp ảnh. Vui lòng thử lại.",
			life: 3000,
		});
		return;
	}

	const canvas = document.createElement("canvas");
	canvas.width = videoElement.value.videoWidth;
	canvas.height = videoElement.value.videoHeight;

	const context = canvas.getContext("2d");
	if (!context) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Không thể xử lý ảnh. Vui lòng thử lại.",
			life: 3000,
		});
		return;
	}

	context.drawImage(videoElement.value, 0, 0);
	capturedImage.value = canvas.toDataURL("image/jpeg");
	stopCamera();
};

const retakePhoto = () => {
	capturedImage.value = null;
	startCamera();
};

const confirmPhoto = () => {
	if (capturedImage.value) {
		const base64Data = capturedImage.value.split(",")[1];
		emit("photo-captured", base64Data);
	}
};

onMounted(() => {
	startCamera();
});

onUnmounted(() => {
	stopCamera();
});
</script>

<style scoped>
.camera-container {
	background-color: #000;
}

.card-guidelines {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.guideline-box {
	width: 320px;
	height: 200px;
	border: 2px solid white;
	border-radius: 8px;
	margin-bottom: 1rem;
}
</style>
