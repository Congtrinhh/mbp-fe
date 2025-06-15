<template>
	<Dialog v-if="internalVisible" v-model:visible="internalVisible" modal header="Gửi offer" id="sendOfferDialog">
		<Form :resolver="offerFormResolver" :initialValues="offer" @submit="onOfferFormSubmit">
			<div class="form-body flex flex-column gap-4">
				<FormField v-slot="$field" name="eventName" class="flex flex-col gap-1">
					<label for="eventName" class="form-label">Tên sự kiện</label>
					<InputText name="eventName" placeholder="Nhập tên sự kiện" v-model="offer.eventName" />
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
							v-model="offer.eventStart"
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
							v-model="offer.eventEnd"
						/>
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
				</div>
				<FormField v-slot="$field" name="place" class="flex flex-col gap-1">
					<label for="place" class="form-label">Địa điểm</label>
					<InputText name="place" placeholder="Nhập địa điểm" v-model="offer.place" />
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>
				<FormField v-slot="$field" name="note" class="flex flex-col gap-1">
					<label for="note" class="form-label">Ghi chú</label>
					<TextArea name="note" placeholder="Nhập ghi chú" v-model="offer.note" />
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>
				<div class="flex justify-end gap-2">
					<Button severity="secondary" label="Hủy" class="escape-button" @click="emit('close')" />
					<Button label="Gửi" class="save-button" type="submit" />
				</div>
			</div>
		</Form>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { z } from "zod";
import cloneDeep from "lodash/cloneDeep";
import { useAuthStore } from "../stores/authStore";
import { NotificationType } from "../enums/notificationType";
import { EntityState } from "../enums/entityState";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { notificationApi } from "@/apis/notificationApi";
import { type Notification } from "@/entities/notification";
import { type SendOfferAdditionalInfo } from "@/entities/notification/additionalInfo/sendOfferAdditionalInfo";
// Define component props and emits
interface Props {
	targetUserId: number; // ID of the user to whom the offer is sent
}
const props = defineProps<Props>();

const internalVisible = defineModel("isVisible", {
	type: Boolean,
	default: false,
});

const emit = defineEmits<{
	(e: "submitted", offer: any): void;
	(e: "close"): void;
}>();

const authStore = useAuthStore();

/**
 * Default offer data structure
 * Initial values for the offer form
 */
const defaultOffer = {
	eventName: "",
	eventStart: new Date(),
	eventEnd: new Date(),
	place: "",
	note: "",
};

/**
 * Reactive reference to the current offer form data
 */
const offer = ref(cloneDeep(defaultOffer));

/**
 * Offer Form Validation Schema
 * Defines validation rules for the offer submission form:
 * - Required event name
 * - Start date must be in the future
 * - End date must be after start date
 * - Optional place and note fields
 */
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

/**
 * Handles Offer Form Submission
 *
 * Processes the submission of booking offers:
 * - Validates form data
 * - Creates notification with offer details
 * - Sends notification to MC
 * - Shows confirmation toast
 * - Resets form on success
 *
 * @param {Object} formInfo - Form submission data containing:
 *   - valid: Form validation status
 *   - values: Form field values
 * @returns {Promise<void>}
 * created by tqcong 20/5/2025.
 */
const onOfferFormSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;
	if (valid) {
		const additionalInfo: SendOfferAdditionalInfo = {
			eventName: values.eventName,
			eventStart: values.eventStart,
			eventEnd: values.eventEnd,
			place: values.place,
			note: values.note,
			senderId: authStore.user?.id,
			senderName: authStore.user?.fullName ?? authStore.user?.nickName,
		};

		const notification: Notification = {
			id: 0,
			userId: props.targetUserId,
			message: "Bạn đã nhận được một offer mới",
			additionalInfo: JSON.stringify(additionalInfo),
			type: NotificationType.SendOffer,
			thumbUrl: authStore.user?.avatarUrl,
			entityState: EntityState.Add,
		};

		await notificationApi.create(notification);
		console.log("Offer submitted and notification sent:", values);

		offer.value = cloneDeep(defaultOffer);
		emit("submitted", null);
	}
};
</script>

<style scoped lang="scss"></style>
