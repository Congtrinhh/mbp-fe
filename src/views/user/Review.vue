<template>
	<main class="main-container">
		<header class="center-header">Đánh giá</header>
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
		<div class="review-form">
			<Form :resolver="reviewFormResolver" @submit="onSubmit" :initialValues="review">
				<div class="form-body flex flex-column gap-4">
					<FormField v-slot="$field" name="overallPoint" class="flex flex-col gap-1">
						<label for="overallPoint" class="form-label">Đánh giá</label>
						<Rating name="overallPoint" v-model="review.overallPoint" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="shortDescription" class="flex flex-col gap-1">
						<label for="shortDescription" class="form-label">Mô tả ngắn</label>
						<InputText name="shortDescription" v-model="review.shortDescription" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>

					<!-- Fields for Client reviewing MC -->
					<template v-if="!isMc">
						<FormField v-slot="$field" name="proPoint" class="flex flex-col gap-1 mt-3">
							<label for="proPoint" class="form-label">Điểm chuyên nghiệp</label>
							<Rating name="proPoint" v-model="review.proPoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
						<FormField v-slot="$field" name="attitudePoint" class="flex flex-col gap-1">
							<label for="attitudePoint" class="form-label">Điểm thái độ</label>
							<Rating name="attitudePoint" v-model="review.attitudePoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</template>

					<!-- Fields for MC reviewing Client -->
					<template v-else>
						<FormField v-slot="$field" name="paymentPunctualPoint" class="flex flex-col gap-1 mt-3">
							<label for="paymentPunctualPoint" class="form-label">Điểm thanh toán đúng hạn</label>
							<Rating name="paymentPunctualPoint" v-model="review.paymentPunctualPoint" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</template>

					<FormField v-slot="$field" name="reliablePoint" class="flex flex-col gap-1">
						<label for="reliablePoint" class="form-label">Điểm tin cậy</label>
						<Rating name="reliablePoint" v-model="review.reliablePoint" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="detailDescription" class="flex flex-col gap-1">
						<label for="detailDescription" class="form-label">Mô tả chi tiết</label>
						<TextArea name="detailDescription" v-model="review.detailDescription" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<Button label="Gửi" class="save-button" type="submit" />
				</div>
			</Form>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { contractApi } from "@/apis/contractApi";
import { clientReviewMcApi } from "@/apis/clientReviewMcApi";
import { mcReviewClientApi } from "@/apis/mcReviewClientApi";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import type { ClientReviewMc } from "@/entities/clientReviewMc";
import type { McReviewClient } from "@/entities/mcReviewClient";
import { useToast } from "primevue/usetoast";
import type { Contract } from "@/entities/contract";
import { useAuthStore } from "@/stores/authStore";
import { NotificationStatus } from "@/enums/notificationStatus";
import { notificationApi } from "@/apis/notificationApi";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const isMc = computed(() => authStore.user?.isMc == "true");

/**
 * sang màn hình chi tiết hợp đồng
 */
const viewContract = () => {
	router.push({ name: "user-contract-detail", params: { id: contractId } });
};

//#region State
const route = useRoute();
const contractId = Number(route.params.contractId);
const notificationId = Number(route.params.notificationId); // Receive notification ID
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

//#region Form Resolver
const reviewFormResolver = computed(() => {
	// Base schema with common fields
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

//#region Fetch Contract
const contract = ref<Contract>();
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

//#region On Submit
const onSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;
	if (valid) {
		try {
			if (isMc.value) {
				// MC reviewing Client
				const mcReview: McReviewClient = {
					...values,
					contractId: contractId,
					mcId: authStore.user?.id,
					clientId: contract.value?.clientId,
				};
				await mcReviewClientApi.create(mcReview);
			} else {
				// Client reviewing MC
				const clientReview: ClientReviewMc = {
					...values,
					contractId: contractId,
					clientId: authStore.user?.id,
					mcId: contract.value?.mcId,
				};
				await clientReviewMcApi.create(clientReview);
			}

			// Update notification status after successful review submission
			try {
				await notificationApi.update(notificationId, {
					id: notificationId,
					status: NotificationStatus.NotEditable,
				});
			} catch (error) {
				console.error("Không thể cập nhật trạng thái thông báo", error);
				toast.add({
					severity: "error",
					summary: "Cập nhật trạng thái thông báo thất bại",
					detail: "Có lỗi khi cập nhật trạng thái thông báo",
					life: 3000,
				});
			}

			router.push({ name: "user-notification-list" });
			toast.add({
				severity: "success",
				summary: "Đã gửi đánh giá",
				detail: "Đánh giá của bạn đã được gửi thành công",
				life: 3000,
			});
		} catch (error) {
			console.error("Không thể gửi đánh giá", error);
			toast.add({
				severity: "error",
				summary: "Gửi đánh giá thất bại",
				detail: "Có lỗi khi gửi đánh giá của bạn",
				life: 3000,
			});
		}
	}
};
//#endregion

//#region On Mounted
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
}
.value {
	display: flex;
	align-items: center;
}
</style>
