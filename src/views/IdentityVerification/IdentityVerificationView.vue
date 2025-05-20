<template>
	<main class="main-container p-4">
		<!-- Step Progress -->
		<div v-if="!isVerified" class="steps-container mb-8">
			<div class="flex justify-between items-center">
				<div v-for="(step, index) in steps" :key="index" class="step-item flex-1 text-center">
					<div
						:class="[
							'step-number mx-auto mb-2 rounded-full w-8 h-8 flex items-center justify-center',
							currentStep == index ? 'active' : 'bg-gray-200',
						]"
					>
						{{ index + 1 }}
					</div>
					<div class="step-label text-sm">{{ step.label }}</div>
				</div>
			</div>
		</div>

		<!-- Step Content -->
		<div class="step-content">
			<!-- Overview Step -->
			<div v-if="currentStep === 0" class="text-center">
				<h2 class="text-xl font-semibold mb-4">Xác minh danh tính</h2>
				<p class="mb-6">Hãy thực hiện các bước sau để xác minh danh tính của bạn:</p>
				<ul class="text-left mb-6 space-y-4">
					<li v-for="(step, index) in steps" :key="index" class="flex items-start">
						<span class="mr-2">{{ index + 1 }}.</span>
						<span>{{ step.description }}</span>
					</li>
				</ul>
				<Button @click="startVerification" severity="primary" label="Bắt đầu" />
			</div>

			<!-- Face Photo Step -->
			<face-capture-step
				v-if="currentStep === 1"
				@photo-captured="handleFacePhotoCaptured"
				@back="currentStep--"
			/>

			<!-- ID Card Front Step -->
			<id-card-capture-step
				v-if="currentStep === 2"
				side="front"
				@photo-captured="handleIdCardFrontCaptured"
				@back="currentStep--"
			/>

			<!-- ID Card Back Step -->
			<id-card-capture-step
				v-if="currentStep === 3"
				side="back"
				@photo-captured="handleIdCardBackCaptured"
				@back="currentStep--"
			/>

			<!-- Information Confirmation Step -->
			<information-verification-step
				v-if="(currentStep === 4 && idInfo) || (isVerified && idInfo)"
				:id-info="idInfo"
				:is-verified="isVerified"
				:verified-at="status?.verifiedAt"
				@confirm="handleInfoConfirmed"
				@back="currentStep--"
			/>

			<div v-if="currentStep === 4 && !idInfo" class="text-center">
				<p class="text-red-500">Không thể tải thông tin. Vui lòng thử lại.</p>
				<Button @click="currentStep--" severity="secondary" label="Quay lại" class="mt-4" />
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { idVerificationApi } from "@/apis/idVerificationApi";
import type { IdInfo, UserIdVerification } from "@/entities/idVerification";
import FaceCaptureStep from "@/components/identity-verification/FaceCaptureStep.vue";
import IdCardCaptureStep from "@/components/identity-verification/IdCardCaptureStep.vue";
import InformationVerificationStep from "@/components/identity-verification/InformationVerificationStep.vue";

const router = useRouter();
const toast = useToast();
const currentStep = ref(0);
const idInfo = ref<IdInfo | null>(null);
const isVerified = ref(false);
const status = ref<UserIdVerification | null>(null);

const steps = [
	{
		label: `Các bước thực hiện`,
		description: "Xem tổng quan các bước xác minh danh tính",
	},
	{
		label: "Ảnh khuôn mặt",
		description: "Chụp ảnh khuôn mặt của bạn",
	},
	{
		label: "CCCD Mặt trước",
		description: "Chụp ảnh mặt trước CCCD của bạn",
	},
	{
		label: "CCCD Mặt sau",
		description: "Chụp ảnh mặt sau CCCD của bạn",
	},
	{
		label: "Xác nhận thông tin",
		description: "Xác nhận thông tin từ CCCD của bạn",
	},
];

const startVerification = () => {
	currentStep.value = 1;
};

const handleFacePhotoCaptured = async (photoData: string) => {
	try {
		await idVerificationApi.uploadFacePhoto(photoData);
		currentStep.value = 2;
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.",
			life: 3000,
		});
	}
};

const handleIdCardFrontCaptured = async (photoData: string) => {
	try {
		await idVerificationApi.uploadIdCardPhoto(photoData, "front");
		currentStep.value = 3;
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.",
			life: 3000,
		});
	}
};

const handleIdCardBackCaptured = async (photoData: string) => {
	try {
		await idVerificationApi.uploadIdCardPhoto(photoData, "back");
		idInfo.value = await idVerificationApi.getIdInfo();
		currentStep.value = 4;
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.",
			life: 3000,
		});
	}
};

const handleInfoConfirmed = async () => {
	try {
		if (!idInfo.value) throw new Error("No ID information available");
		await idVerificationApi.confirmInfo(idInfo.value);

		toast.add({
			severity: "success",
			summary: "Thành công",
			detail: "Xác minh danh tính thành công!",
			life: 3000,
		});
		router.push("/settings"); // Redirect back to settings page
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Có lỗi xảy ra khi xác nhận thông tin. Vui lòng thử lại.",
			life: 3000,
		});
	}
};

onMounted(async () => {
	try {
		status.value = await idVerificationApi.getStatus();

		if (!status.value) {
			throw new Error("Failed to load verification status");
		}

		isVerified.value = status.value.status === 1;

		// If verified, load ID info directly
		if (isVerified.value) {
			const info = await idVerificationApi.getIdInfo();
			if (!info) {
				throw new Error("Failed to load ID information");
			}
			idInfo.value = info;
			currentStep.value = 4; // Show information step
		} else if (status.value.currentStep) {
			currentStep.value = status.value.currentStep;
		}
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Có lỗi xảy ra khi tải thông tin. Vui lòng tải lại trang.",
			life: 3000,
		});
	}
});
</script>

<style scoped>
.step-item {
	position: relative;
}

.step-item:not(:last-child)::after {
	content: "";
	position: absolute;
	top: 1rem;
	left: 60%;
	width: 80%;
	height: 2px;
	background-color: #e5e7eb;
}

.step-item:not(:last-child).active::after {
	background-color: var(--primary-color);
}

.step-number {
	z-index: 1;
	position: relative;
}
.step-number.active {
	background-color: #333;
	color: #fff;
}
</style>
