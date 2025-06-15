<template>
	<main class="main-container">
		<header class="center-header">Đánh giá</header>

		<!-- Contract Information -->
		<div class="event-info-container">
			<div class="info-item">
				<label>Sự kiện:</label>
				<div class="value font-medium">{{ contract?.eventName }}</div>
			</div>
			<div v-if="isMc" class="info-item items-center">
				<label>Khách hàng:</label>
				<div class="value">
					<Avatar :image="contract?.client?.avatarUrl" shape="circle" />
					<span class="font-medium p-2">{{ contract?.client?.nickName || contract?.client?.fullName }}</span>
				</div>
			</div>
			<div v-else class="info-item items-center">
				<label>MC:</label>
				<div class="value">
					<Avatar :image="contract?.mc?.avatarUrl" shape="circle" />
					<span class="font-medium p-2">{{ contract?.mc?.nickName || contract?.mc?.fullName }}</span>
				</div>
			</div>
			<div class="underline cursor-pointer view-contract-button" @click="viewContract">Xem hợp đồng</div>
		</div>

		<!-- Review Form -->
		<div class="review-form">
			<Form :resolver="reviewFormResolver" @submit="onSubmit" :initialValues="review">
				<div class="form-body flex flex-column gap-4">
					<!-- Common Fields -->
					<FormField v-slot="$field" name="overallPoint" class="flex flex-col gap-1">
						<label for="overallPoint" class="form-label">Đánh giá</label>
						<Rating name="overallPoint" v-model="review.overallPoint" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
							{{ $field.error?.message }}
						</Message>
					</FormField>

					<FormField v-slot="$field" name="shortDescription" class="flex flex-col gap-1">
						<label for="shortDescription" class="form-label">Mô tả ngắn</label>
						<InputText name="shortDescription" v-model="review.shortDescription" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
							{{ $field.error?.message }}
						</Message>
					</FormField>

					<!-- Client-specific Fields -->
					<template v-if="!isMc">
						<FormField v-slot="$field" name="proPoint" class="flex flex-col gap-1 mt-3">
							<label for="proPoint" class="form-label">Điểm chuyên nghiệp</label>
							<Rating name="proPoint" v-model="review.proPoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
								{{ $field.error?.message }}
							</Message>
						</FormField>

						<FormField v-slot="$field" name="attitudePoint" class="flex flex-col gap-1">
							<label for="attitudePoint" class="form-label">Điểm thái độ</label>
							<Rating name="attitudePoint" v-model="review.attitudePoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
								{{ $field.error?.message }}
							</Message>
						</FormField>
					</template>

					<!-- MC-specific Fields -->
					<template v-else>
						<FormField v-slot="$field" name="paymentPunctualPoint" class="flex flex-col gap-1 mt-3">
							<label for="paymentPunctualPoint" class="form-label">Điểm thanh toán đúng hạn</label>
							<Rating name="paymentPunctualPoint" v-model="review.paymentPunctualPoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
								{{ $field.error?.message }}
							</Message>
						</FormField>
					</template>

					<!-- Common Fields -->
					<FormField v-slot="$field" name="reliablePoint" class="flex flex-col gap-1">
						<label for="reliablePoint" class="form-label">Điểm tin cậy</label>
						<Rating name="reliablePoint" v-model="review.reliablePoint" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
							{{ $field.error?.message }}
						</Message>
					</FormField>

					<FormField v-slot="$field" name="detailDescription" class="flex flex-col gap-1">
						<label for="detailDescription" class="form-label">Mô tả chi tiết</label>
						<TextArea name="detailDescription" v-model="review.detailDescription" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
							{{ $field.error?.message }}
						</Message>
					</FormField>

					<Button label="Gửi" class="save-button" type="submit" />
				</div>
			</Form>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";

// API & Store imports
import { contractApi } from "@/apis/contractApi";
import { clientReviewMcApi } from "@/apis/clientReviewMcApi";
import { mcReviewClientApi } from "@/apis/mcReviewClientApi";
import { notificationApi } from "@/apis/notificationApi";
import { useAuthStore } from "@/stores/authStore";

// Types & Enums
import type { Contract } from "@/entities/contract";
import type { ClientReviewMc } from "@/entities/clientReviewMc";
import type { McReviewClient } from "@/entities/mcReviewClient";
import { NotificationStatus } from "@/enums/notificationStatus";

//#region State Management
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const isMc = computed(() => authStore.user?.isMc == "true");

const contractId = Number(route.params.contractId);
const notificationId = Number(route.params.notificationId);
const contract = ref<Contract>();

const review = ref({
	overallPoint: 5,
	proPoint: 5,
	attitudePoint: 5,
	paymentPunctualPoint: 5,
	reliablePoint: 5,
	shortDescription: "",
	detailDescription: "",
});
//#endregion

//#region Form Validation
const reviewFormResolver = computed(() => {
	const baseSchema = {
		overallPoint: z.number().gte(1).lte(5),
		reliablePoint: z.number().gte(1).lte(5),
		shortDescription: z.string().max(255).optional(),
		detailDescription: z.string().optional(),
	};

	// Add specific fields based on user type
	if (isMc.value) {
		// MC reviewing client
		return zodResolver(
			z.object({
				...baseSchema,
				paymentPunctualPoint: z.number().gte(1).lte(5),
			})
		);
	} else {
		// Client reviewing MC
		return zodResolver(
			z.object({
				...baseSchema,
				proPoint: z.number().gte(1).lte(5),
				attitudePoint: z.number().gte(1).lte(5),
			})
		);
	}
});
//#endregion

//#region Data Loading
const getContract = async (): Promise<Contract | null> => {
	try {
		const contract = await contractApi.getById(contractId);
		return contract;
	} catch (error) {
		console.error("Không thể tải hợp đồng", error);
		return null;
	}
};
//#endregion

//#region Form Submission
const onSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;
	if (!valid) return;

	try {
		await submitReview(values);
		await updateNotificationStatus();
		navigateBackAndShowSuccess();
	} catch (error) {
		console.error("Không thể gửi đánh giá", error);
		showErrorToast("Có lỗi khi gửi đánh giá của bạn");
	}
};

const submitReview = async (values: any) => {
	if (isMc.value) {
		const mcReview: McReviewClient = {
			...values,
			contractId: contractId,
			mcId: authStore.user?.id,
			clientId: contract.value?.clientId,
		};
		await mcReviewClientApi.create(mcReview);
	} else {
		const clientReview: ClientReviewMc = {
			...values,
			contractId: contractId,
			clientId: authStore.user?.id,
			mcId: contract.value?.mcId,
		};
		await clientReviewMcApi.create(clientReview);
	}
};

const updateNotificationStatus = async () => {
	try {
		await notificationApi.update(notificationId, {
			id: notificationId,
			status: NotificationStatus.NotEditable,
		});
	} catch (error) {
		console.error("Không thể cập nhật trạng thái thông báo", error);
		showErrorToast("Có lỗi khi cập nhật trạng thái thông báo");
	}
};
//#endregion

//#region Navigation & UI
const viewContract = () => {
	router.push({ name: "user-contract-detail", params: { id: contractId } });
};

const navigateBackAndShowSuccess = () => {
	router.push({ name: "user-notification-list" });
	showSuccessToast();
};

const showSuccessToast = () => {
	toast.add({
		severity: "success",
		summary: "Đã gửi đánh giá",
		detail: "Đánh giá của bạn đã được gửi thành công",
		life: 3000,
	});
};

const showErrorToast = (message: string) => {
	toast.add({
		severity: "error",
		summary: "Gửi đánh giá thất bại",
		detail: message,
		life: 3000,
	});
};
//#endregion

//#region Lifecycle Hooks
onMounted(async () => {
	contract.value = await getContract();
});
//#endregion
</script>

<style lang="scss" scoped>
.main-container {
	background-color: #fff;
	display: flex;
	flex-direction: column;
}

.review-form {
	padding: 16px;
}

.form-label {
	font-weight: bold;
}

.event-info-container {
	padding: 16px 16px 0;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 12px;

	.value {
		display: flex;
		align-items: center;
	}
}

.view-contract-button {
	margin-top: 12px;
	color: var(--primary-color);
}
</style>
