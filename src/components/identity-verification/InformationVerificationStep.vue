<!--
* InformationVerificationStep.vue
*
* ID information verification and editing component.
* Displays and validates extracted ID card information:
* - Basic personal information
* - Address information
* - ID card details
*
* Features:
* - Form validation
* - Editable/Read-only modes
* - Field grouping and organization
* - Responsive layout
* - Status-based display
* - Date formatting
-->
<template>
	<div class="information-verification-step">
		<h2 class="text-xl font-semibold mb-4 text-center">
			{{ props.isVerified ? "Thông tin xác minh danh tính" : "Xác nhận thông tin" }}
		</h2>

		<div v-if="props.isVerified" class="p-3 pt-0">
			<span>Xác thực vào: </span>
			<span v-format-date="props.verifiedAt"></span>
		</div>

		<div class="bg-gray-50 rounded-lg">
			<p v-if="!props.isVerified" class="text-sm text-gray-600 mb-4 px-4 pt-4">
				Vui lòng kiểm tra kỹ thông tin được trích xuất từ CCCD của bạn
			</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Basic Information -->
				<div class="info-group">
					<h3 class="text-lg font-medium mb-3">Thông tin cơ bản</h3>

					<div class="info-field">
						<label>Số CCCD</label>
						<InputText v-model="editableInfo.idNumber" class="w-full" :disabled="!isEditing" />
					</div>

					<div class="info-field">
						<label>Họ và tên</label>
						<InputText v-model="editableInfo.name" class="w-full" :disabled="!isEditing" />
					</div>

					<div class="info-field">
						<label>Ngày sinh</label>
						<DatePicker
							v-model="editableInfo.dob"
							class="w-full"
							:disabled="!isEditing"
							:showIcon="true"
							dateFormat="dd/mm/yy"
						/>
					</div>

					<div class="info-field">
						<label>Giới tính</label>
						<InputText v-model="editableInfo.sex" class="w-full" :disabled="!isEditing" />
					</div>

					<div class="info-field">
						<label>Quốc tịch</label>
						<InputText v-model="editableInfo.nationality" class="w-full" :disabled="!isEditing" />
					</div>
				</div>

				<!-- Additional Information -->
				<div class="info-group">
					<h3 class="text-lg font-medium mb-3">Thông tin khác</h3>

					<div class="info-field">
						<label>Quê quán</label>
						<InputText v-model="editableInfo.home" class="w-full" :disabled="!isEditing" />
					</div>

					<div class="info-field">
						<label>Nơi thường trú</label>
						<InputText v-model="editableInfo.address" class="w-full" :disabled="!isEditing" />
					</div>

					<div class="info-field">
						<label>Đặc điểm nhận dạng</label>
						<InputText v-model="editableInfo.features" class="w-full" :disabled="!isEditing" />
					</div>
				</div>

				<!-- Card Information -->
				<div class="info-group md:col-span-2">
					<h3 class="text-lg font-medium mb-3">Thông tin thẻ</h3>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="info-field">
							<label>Ngày cấp</label>
							<DatePicker
								dateFormat="dd/mm/yy"
								v-model="editableInfo.issueDate"
								class="w-full"
								:disabled="!isEditing"
								:showIcon="true"
							/>
						</div>

						<div class="info-field">
							<label>Nơi cấp</label>
							<InputText v-model="editableInfo.issueLoc" class="w-full" :disabled="!isEditing" />
						</div>

						<div class="info-field">
							<label>Ngày hết hạn</label>
							<DatePicker
								dateFormat="dd/mm/yy"
								v-model="editableInfo.doe"
								class="w-full"
								:disabled="!isEditing"
								:showIcon="true"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div v-if="!props.isVerified" class="flex justify-between mt-6">
				<Button @click="$emit('back')" severity="secondary" label="Quay lại" />
				<div class="flex gap-2">
					<Button v-if="isEditing" @click="cancelEditing" severity="secondary" label="Hủy" />
					<Button
						@click="isEditing ? saveChanges() : confirmInfo()"
						severity="primary"
						:label="isEditing ? 'Lưu' : 'Xác nhận'"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import type { IdInfo } from "@/entities/idVerification";

//#region Props & Emits
const props = defineProps<{
	idInfo: IdInfo;
	verifiedAt?: Date;
	isVerified?: boolean;
}>();

const emit = defineEmits<{
	(e: "confirm"): void;
	(e: "back"): void;
}>();
//#endregion

//#region State
const toast = useToast();
const isEditing = ref(false);
const editableInfo = ref<IdInfo>({ ...props.idInfo });

// Define required fields for validation
const requiredFields: (keyof IdInfo)[] = [
	"idNumber",
	"name",
	"dob",
	"sex",
	"nationality",
	"home",
	"address",
	"issueDate",
	"issueLoc",
	"doe",
];
//#endregion

//#region Form Validation
const validateInfo = (): boolean => {
	const missingFields = requiredFields.filter((field) => !editableInfo.value[field]);

	if (missingFields.length > 0) {
		toast.add({
			severity: "error",
			summary: "Thiếu thông tin",
			detail: "Vui lòng điền đầy đủ các thông tin bắt buộc",
			life: 3000,
		});
		return false;
	}

	return true;
};
//#endregion

//#region Edit Mode Handlers
const startEditing = () => {
	isEditing.value = true;
};

const cancelEditing = () => {
	editableInfo.value = { ...props.idInfo };
	isEditing.value = false;
};

const saveChanges = () => {
	if (validateInfo()) {
		Object.assign(props.idInfo, editableInfo.value);
		isEditing.value = false;
		toast.add({
			severity: "success",
			summary: "Thành công",
			detail: "Đã cập nhật thông tin thành công",
			life: 3000,
		});
	}
};
//#endregion

//#region Form Submission
const confirmInfo = () => {
	if (validateInfo()) {
		emit("confirm");
	}
};
//#endregion

//#region Lifecycle Hooks
onMounted(() => {
	editableInfo.value = { ...props.idInfo };
});
//#endregion
</script>

<style scoped>
.info-field {
	margin-bottom: 1rem;
}

.info-field label {
	display: block;
	font-size: 0.875rem;
	color: #666;
	margin-bottom: 0.25rem;
}

.info-group {
	background: white;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-inputtext:disabled) {
	background: #f3f4f6;
	color: #374151;
	opacity: 1;
}
</style>
