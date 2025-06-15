<template>
	<div>
		<main class="main-container">
			<Fieldset>
				<template #legend>
					<div class="flex items-center pl-2">
						<span>Offer gửi từ &nbsp;</span>
						<Avatar
							:image="notification?.thumbUrl"
							shape="circle"
							@click="redirectToProfile(additionalInfo?.senderId)"
						/>
						<span class="font-bold p-2">{{ additionalInfo?.senderName }}</span>
					</div>
				</template>
				<span class="view-client-reviews" @click="toClientReviewTab">Thông tin đánh giá về khách hàng</span>

				<!-- Offer Information Display -->
				<div class="info-container" v-if="additionalInfo">
					<div class="info-item">
						<label>Tên sự kiện:</label>
						<div class="value">{{ additionalInfo.eventName }}</div>
					</div>
					<div class="info-item">
						<label>Bắt đầu:</label>
						<div class="value" v-format-date="additionalInfo.eventStart"></div>
					</div>
					<div class="info-item">
						<label>Kết thúc:</label>
						<div class="value" v-format-date="additionalInfo.eventEnd"></div>
					</div>
					<div class="info-item">
						<label>Địa điểm:</label>
						<div class="value">{{ additionalInfo.place }}</div>
					</div>
					<div class="info-item">
						<label>Ghi chú:</label>
						<div class="value">{{ additionalInfo.note }}</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="button-container" v-if="notification?.status === NotificationStatus.Editable">
					<Button label="Từ chối" class="p-button-danger" @click="handleReject" />
					<Button label="Đồng ý" class="p-button-success" @click="handleApprove" />
				</div>
			</Fieldset>
		</main>

		<!-- Dialogs -->
		<ConfirmDialog></ConfirmDialog>

		<Dialog
			v-model:visible="showTimeConflictDialog"
			modal
			:closable="false"
			:style="{ width: '90vw', maxWidth: '400px' }"
		>
			<template #header>
				<span class="font-bold">Xung đột thời gian</span>
			</template>
			<div>{{ conflictMessage }}</div>
			<div class="mt-4">
				<a href="#" class="text-primary underline" @click.prevent="goToConflictingContract">
					{{ conflictEventName }}
				</a>
			</div>
			<template #footer>
				<Button label="OK" @click="hideTimeConflictDialog" class="p-button-primary" />
			</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

// API & Store imports
import { notificationApi } from "@/apis/notificationApi";
import { contractApi } from "@/apis/contractApi";
import { useAuthStore } from "@/stores/authStore";
import { useRedirect } from "@/composables/useRedirect";

// Type & Enum imports
import type { Notification } from "@/entities/notification";
import type { Contract } from "@/entities/contract";
import type { ApiErrorResponse } from "@/entities/api/apiErrorResponse";
import type { TimeConflictEventInfo } from "@/entities/contract/timeConflictEventInfo";
import type {
	SendOfferAdditionalInfo,
	RejectOfferAdditionalInfo,
	OfferApprovedAdditionalInfo,
} from "@/entities/notification/additionalInfo";
import { NotificationStatus } from "@/enums/notificationStatus";
import { NotificationType } from "@/enums/notificationType";

//#region State Management
const notification = ref<Notification | null>(null);
const additionalInfo = ref<SendOfferAdditionalInfo | null>(null);
const showTimeConflictDialog = ref(false);
const conflictMessage = ref("");
const conflictEventName = ref("");
const conflictContractId = ref<number | null>(null);

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { redirectToProfile } = useRedirect();
const toast = useToast();
const confirm = useConfirm();
//#endregion

//#region Data Loading
const fetchNotificationDetails = async (id: string) => {
	try {
		const response = await notificationApi.getById(parseInt(id));
		if (!response.additionalInfo) return;
		notification.value = response;
		additionalInfo.value = JSON.parse(response.additionalInfo as string);
	} catch (error) {
		console.error("Failed to fetch notification details", error);
		router.push({ name: "user-notification-list" });
	}
};
//#endregion

//#region Offer Actions
const handleReject = async () => {
	try {
		if (additionalInfo.value?.senderId) {
			const rejectOfferAdditionalInfo: RejectOfferAdditionalInfo = {
				notificationId: notification.value?.id,
			};

			await notificationApi.create({
				id: 0,
				userId: additionalInfo.value.senderId,
				type: NotificationType.OfferRejected,
				message: `Offer cho sự kiện ${additionalInfo.value.eventName} của bạn đã bị từ chối.`,
				isRead: false,
				additionalInfo: JSON.stringify(rejectOfferAdditionalInfo),
				thumbUrl: authStore.user?.avatarUrl,
				entityState: 0,
			} as Notification);

			if (notification.value) {
				await notificationApi.update(notification.value.id, {
					...notification.value,
					status: NotificationStatus.NotEditable,
				});
			}
		}

		router.push({ name: "user-notification-list" });
		toast.add({
			severity: "success",
			summary: "Đã từ chối",
			detail: "Bạn đã từ chối yêu cầu",
			life: 3000,
		});
	} catch (error) {
		console.error("Failed to reject the offer", error);
		toast.add({
			severity: "error",
			summary: "Lỗi",
			detail: "Không thể từ chối yêu cầu",
			life: 3000,
		});
	}
};

const handleApprove = async () => {
	try {
		if (!additionalInfo.value?.senderId) return;

		const contract: Contract = {
			id: 0,
			clientId: additionalInfo.value.senderId,
			mcId: authStore.user?.id ?? 0,
			eventStart: additionalInfo.value.eventStart,
			eventEnd: additionalInfo.value.eventEnd,
			description: additionalInfo.value.note,
			place: additionalInfo.value.place,
			eventName: additionalInfo.value.eventName,
			entityState: 0,
			isActive: true,
		};

		try {
			await createContractAndNotify(contract);
		} catch (error: any) {
			handleApprovalError(error, contract);
		}
	} catch (error) {
		console.error("Failed to approve the offer", error);
		showErrorToast();
	}
};

const createContractAndNotify = async (contract: Contract) => {
	const newContract = await contractApi.create(contract);
	await sendApprovalNotification(newContract.id);
	await updateOriginalNotification();

	router.push({ name: "user-contract-list" });
	showSuccessToast();
};
//#endregion

//#region Error Handling
const handleApprovalError = async (error: any, contract: Contract) => {
	const errorResponse = error.response?.data as ApiErrorResponse;

	if (error.response?.status === 409) {
		handleTimeConflict(errorResponse);
		return;
	}

	if (error.response?.status === 430) {
		handleBufferWarning(errorResponse, contract);
		return;
	}

	console.error("Failed to approve the offer", error);
	showErrorToast();
};

const handleTimeConflict = (errorResponse: ApiErrorResponse) => {
	const conflictEvent = errorResponse.additionalInfo[0] as TimeConflictEventInfo;
	conflictMessage.value = errorResponse.message;
	conflictEventName.value = conflictEvent.eventName;
	conflictContractId.value = conflictEvent.contractId;
	showTimeConflictDialog.value = true;
};

const handleBufferWarning = (errorResponse: ApiErrorResponse, contract: Contract) => {
	confirm.require({
		header: "Cảnh báo",
		message: errorResponse.message,
		acceptLabel: "Có",
		rejectLabel: "Không",
		acceptClass: "p-button-primary",
		rejectClass: "p-button-secondary",
		accept: async () => {
			try {
				await retryContractCreation({ ...contract, isIgnoreBufferCheck: true });
			} catch (retryError) {
				console.error("Failed to approve the offer", retryError);
				showErrorToast();
			}
		},
	});
};
//#endregion

//#region Helper Functions
const sendApprovalNotification = async (contractId: number) => {
	if (!additionalInfo.value) return;

	await notificationApi.create({
		id: 0,
		userId: additionalInfo.value.senderId,
		type: NotificationType.OfferApproved,
		message: `Offer cho sự kiện ${additionalInfo.value.eventName} của bạn đã được chấp nhận.`,
		thumbUrl: authStore.user?.avatarUrl,
		additionalInfo: JSON.stringify({ contractId } as OfferApprovedAdditionalInfo),
		isRead: false,
		entityState: 0,
	} as Notification);
};

const updateOriginalNotification = async () => {
	if (notification.value) {
		await notificationApi.update(notification.value.id, {
			...notification.value,
			status: NotificationStatus.NotEditable,
		});
	}
};

const retryContractCreation = async (contract: Contract) => {
	const newContract = await contractApi.create(contract);
	await sendApprovalNotification(newContract.id);
	await updateOriginalNotification();

	router.push({ name: "user-contract-list" });
	showSuccessToast();
};

const showSuccessToast = () => {
	toast.add({
		severity: "success",
		summary: "Thành công",
		detail: "Đã chấp nhận yêu cầu của khách hàng",
		life: 3000,
	});
};

const showErrorToast = () => {
	toast.add({
		severity: "error",
		summary: "Lỗi",
		detail: "Không thể chấp nhận yêu cầu của khách hàng",
		life: 3000,
	});
};
//#endregion

//#region Navigation
const hideTimeConflictDialog = () => {
	showTimeConflictDialog.value = false;
};

const goToConflictingContract = () => {
	if (conflictContractId.value) {
		hideTimeConflictDialog();
		router.push({
			name: "user-contract-detail",
			params: { id: conflictContractId.value },
		});
	}
};

const toClientReviewTab = () => {
	router.push({
		name: "user-profile",
		params: {
			id: additionalInfo.value?.senderId,
			tabIndex: 3,
		},
	});
};
//#endregion

//#region Lifecycle Hooks
onMounted(() => {
	const id = route.params.id as string;
	if (id) {
		fetchNotificationDetails(id);
	} else {
		router.push({ name: "user-notification-list" });
	}
});
//#endregion
</script>

<style lang="scss" scoped>
.main-container {
	display: flex;
	flex-direction: column;
	padding: 0 12px 12px;
	margin-bottom: 60px;
}

.info-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 20px;
}

.info-item {
	display: flex;

	label {
		flex: 0 0 auto;
		width: max-content;
		margin-right: 4px;
		font-weight: 500;
	}

	.value {
		font-weight: 500;
	}
}

.button-container {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.text-primary {
	color: var(--primary-color);
}

:deep(.p-dialog-header) {
	padding: 1rem 1.5rem;
}

:deep(.p-dialog-content) {
	padding: 0 1.5rem 1.5rem 1.5rem;
}

:deep(.p-dialog-footer) {
	padding: 1rem 1.5rem;
}

.view-client-reviews {
	text-decoration: underline;
	cursor: pointer;
	margin: 0 0 12px 0;
	display: inline-block;
}
</style>
