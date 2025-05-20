<template>
	<main class="main-container">
		<header class="center-header">Thông báo</header>
		<div class="notification-list" @scroll="handleScroll">
			<div
				v-for="notification in notifications"
				:key="notification.id"
				:class="{ 'notification-item': true, unread: !notification.isRead }"
				@click="handleNotificationClick(notification)"
			>
				<div class="img-parent rounded"><img :src="notification.thumbUrl" alt="notification thumbnail" /></div>
				<div class="info">
					<div class="content line-clamp-3">{{ notification.message }}</div>
					<div class="ago" v-format-date:isRelativeNow="notification.createdAt"></div>
				</div>
			</div>
		</div>
		<Dialog v-model:visible="showResendOfferDialog" header="Gửi lại offer" id="sendOfferDialog">
			<Form :resolver="offerFormResolver" :initialValues="resendOffer" @submit="onResendOfferSubmit">
				<div class="form-body flex flex-column gap-4">
					<FormField v-slot="$field" name="eventName" class="flex flex-col gap-1">
						<label for="eventName" class="form-label">Tên sự kiện</label>
						<InputText name="eventName" placeholder="Nhập tên sự kiện" v-model="resendOffer.eventName" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<div class="flex gap-4">
						<FormField v-slot="$field" name="eventStart" class="flex flex-col gap-1 flex-1">
							<label for="eventStart" class="form-label">Thời gian bắt đầu</label>
							<DatePicker
								showIcon
								showTime
								hourFormat="24"
								name="eventStart"
								placeholder="Chọn ngày bắt đầu"
								v-model="resendOffer.eventStart"
							/>
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
						<FormField v-slot="$field" name="eventEnd" class="flex flex-col gap-1 flex-1">
							<label for="eventEnd" class="form-label">Thời gian kết thúc</label>
							<DatePicker
								showIcon
								showTime
								hourFormat="24"
								name="eventEnd"
								placeholder="Chọn ngày kết thúc"
								v-model="resendOffer.eventEnd"
							/>
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</div>
					<FormField v-slot="$field" name="place" class="flex flex-col gap-1">
						<label for="place" class="form-label">Địa điểm</label>
						<InputText name="place" placeholder="Nhập địa điểm" v-model="resendOffer.place" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="note" class="flex flex-col gap-1">
						<label for="note" class="form-label">Ghi chú</label>
						<TextArea name="note" placeholder="Nhập ghi chú" v-model="resendOffer.note" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<div class="flex justify-end gap-2">
						<Button
							severity="secondary"
							label="Hủy"
							class="escape-button"
							@click="showResendOfferDialog = false"
						/>
						<Button label="Gửi" class="save-button" type="submit" />
					</div>
				</div>
			</Form>
		</Dialog>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from "vue";
import { notificationApi } from "@/apis/notificationApi";
import { useRouter } from "vue-router";
import { NotificationType } from "@/enums/notificationType";
import { useAuthStore } from "@/stores/authStore";
import { type Notification } from "@/entities/notification";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { useAppStore } from "@/stores/appStore";
import { NotificationStatus } from "@/enums/notificationStatus";

//#region State
const notifications = ref<Notification[]>([]);
const page = ref(0);
const pageSize = 20;
const loading = ref(false);
const showResendOfferDialog = ref(false);
const resendOffer = reactive({
	eventName: "",
	eventStart: new Date(),
	eventEnd: new Date(),
	place: "",
	note: "",
	senderId: 0,
});
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
//#endregion

//#region Form Resolver
const offerFormResolver = zodResolver(
	z
		.object({
			eventName: z.string().min(1, { message: "Vui lòng nhập tên sự kiện" }),
			eventStart: z.date().refine((date) => date >= new Date(), {
				message: "Thời gian bắt đầu phải lớn hơn hoặc bằng thời gian hiện tại",
			}),
			eventEnd: z.date(),
			place: z.string().optional(),
			note: z.string().optional(),
		})
		.refine(
			(formValue) => {
				const eventStart = formValue.eventStart;
				const eventEnd = formValue.eventEnd;
				return eventStart < eventEnd;
			},
			{ message: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu", path: ["eventEnd"] }
		)
);
//#endregion

//#region Fetch Notifications
const fetchNotifications = async () => {
	if (loading.value) return;
	loading.value = true;
	try {
		const response = await notificationApi.getPaged({
			pageIndex: page.value,
			pageSize,
			sort: "created_at DESC",
			userId: authStore.user?.id,
		});

		if (response && response.items.length > 0) {
			notifications.value.push(...response.items);
			page.value++;
		}
	} catch (error) {
		console.error("Không thể tải thông báo", error);
	} finally {
		loading.value = false;
	}
};
//#endregion

//#region Handle Scroll
const handleScroll = (event: any) => {
	const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
	if (bottom) {
		fetchNotifications();
	}
};
//#endregion

//#region Handle Notification Click
const handleNotificationClick = async (notification: Notification) => {
	if (!notification.isRead) {
		try {
			await notificationApi.update(notification.id, { id: notification.id, isRead: true });
			notification.isRead = true;
			useAppStore().unreadNotificationCount--;
		} catch (error) {
			console.error("Không thể cập nhật trạng thái thông báo", error);
		}
	}

	if (notification.status === NotificationStatus.NotEditable) {
		toast.add({
			severity: "info",
			summary: "Thông báo",
			detail: "Thao tác không khả dụng",
			life: 3000,
		});
		return;
	}

	// Perform actions based on notification type
	if (notification.type === NotificationType.SendOffer) {
		router.push({
			name: "user-offer-detail",
			params: {
				id: notification.id,
			},
		});
	} else if (notification.type === NotificationType.OfferRejected) {
		try {
			if (notification.additionalInfo) {
				//id thông báo gửi offer
				const { notificationId } = JSON.parse(notification.additionalInfo);
				if (notificationId) {
					const originalNotification = await notificationApi.getById(notificationId);

					if (originalNotification.additionalInfo) {
						const originalInfo = JSON.parse(originalNotification.additionalInfo);

						resendOffer.eventName = originalInfo.eventName;
						resendOffer.eventStart = new Date(originalInfo.eventStart);
						resendOffer.eventEnd = new Date(originalInfo.eventEnd);
						resendOffer.place = originalInfo.place;
						resendOffer.note = originalInfo.note;
						resendOffer.senderId = originalNotification.userId;
					}
				}
			}
			showResendOfferDialog.value = true;
		} catch (error) {
			console.error("Không thể tải dữ liệu offer gốc", error);
		}
	} else if (notification.type === NotificationType.OfferApproved) {
		if (notification.additionalInfo) {
			const { contractId } = JSON.parse(notification.additionalInfo);
			router.push({
				name: "user-contract-detail",
				params: {
					id: contractId,
				},
			});
		}
	} else if (notification.type === NotificationType.ReviewReminder) {
		if (notification.additionalInfo) {
			const { contractId } = JSON.parse(notification.additionalInfo);
			router.push({
				name: "user-review",
				params: {
					contractId,
					notificationId: notification.id, // Pass the notification ID
				},
			});
		}
	} else if (notification.type === NotificationType.ContractCanceled) {
		if (notification.additionalInfo) {
			const { contractId } = JSON.parse(notification.additionalInfo);
			router.push({
				name: "user-contract-detail",
				params: {
					id: contractId,
				},
			});
		}
	}
};
//#endregion

//#region Resend Offer Submit
const onResendOfferSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;
	if (valid) {
		try {
			await notificationApi.create({
				id: 0,
				userId: resendOffer.senderId,
				type: NotificationType.SendOffer,
				message: "Bạn đã nhận được một offer mới",
				additionalInfo: JSON.stringify({
					eventName: values.eventName,
					eventStart: values.eventStart,
					eventEnd: values.eventEnd,
					place: values.place,
					note: values.note,
					senderId: authStore.user?.id,
					senderName: authStore.user?.fullName ?? authStore.user?.nickName,
				}),
				thumbUrl: authStore.user?.avatarUrl,
			});
			showResendOfferDialog.value = false;
			toast.add({
				severity: "success",
				summary: "Đã gửi lại offer",
				detail: "Offer đã được gửi lại thành công",
				life: 3000,
			});
		} catch (error) {
			console.error("Không thể gửi lại offer", error);
		}
	}
};
//#endregion

//#region SignalR Connection

//#endregion

//#region On Mounted
onMounted(() => {
	const connection = authStore.notificationConnection;
	connection?.on("ReceiveNotification", (message: string) => {
		// Refresh the notification list
		page.value = 0;
		notifications.value = [];
		fetchNotifications();
	});

	fetchNotifications();
});

//#endregion
</script>

<style lang="scss" scoped>
.main-container {
	background-color: #fff;
	display: flex;
	flex-direction: column;
}

.notification-list {
	display: flex;
	flex-direction: column;
	overflow-y: auto;
}

.notification-item {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 12px;

	&.unread {
		background-color: #eeeeee;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		.title {
			font-weight: 600;
			font-size: 1rem;
		}
		.ago {
			font-size: 0.9rem;
		}
	}
}

.img-parent {
	height: 40px;
	width: 40px;
	flex-shrink: 0;
}
</style>
