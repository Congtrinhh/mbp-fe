<template>
	<div class="tab-content-wrapper">
		<!-- MC editing form - keeps all original fields -->
		<Form
			v-if="editingMode == EditingMode.Update && user.isMc"
			class="flex flex-col gap-4 w-full sm:w-56"
			:resolver="mcFormResolver"
			:initialValues="formInitialValues"
			@submit="onFormSubmit"
		>
			<div class="top">
				<Button
					type="button"
					severity="secondary"
					v-if="editingMode == EditingMode.Update"
					@click="cancelEditGeneralInfo"
					width="80px"
				>
					Hủy
				</Button>
				<Button v-if="editingMode == EditingMode.Update" type="submit"> Lưu </Button>
			</div>

			<FormField name="nickName" class="flex flex-col gap-1" v-slot="$field">
				<label for="nickName" class="form-label">Nghệ danh</label>
				<InputText type="text" placeholder="Nhập nghệ danh" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>
			<FormField name="mcTypes" class="flex flex-col gap-1" v-slot="$field">
				<label for="mcTypes" class="form-label">Loại MC</label>
				<MultiSelect :options="mcTypes" optionLabel="label" placeholder="Chọn loại MC" class="w-full md:w-80" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>
			<FormField name="hostingStyles" class="flex flex-col gap-1" v-slot="$field">
				<label for="hostingStyles" class="form-label">Phong cách dẫn</label>
				<MultiSelect
					:options="hostingStyles"
					optionLabel="label"
					placeholder="Chọn phong cách dẫn"
					class="w-full md:w-80"
				/>
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="isNewbie" class="flex flex-col gap-1" v-slot="$field">
				<label for="isNewbie" class="form-label">MC mới</label>
				<Checkbox inputId="isNewbie" name="isNewbie" binary />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="description" class="flex flex-col gap-1" v-slot="$field">
				<label for="description" class="form-label">Mô tả về bản thân</label>
				<Textarea rows="5" cols="30" placeholder="Nhập mô tả về bản thân" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="gender" class="flex flex-col gap-1" v-slot="$field">
				<label for="gender" class="form-label">Giới tính</label>
				<Select
					:options="genders"
					option-label="name"
					option-value="code"
					placeholder="Chọn giới tính"
					class="w-full md:w-56"
				/>
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="age" class="flex flex-col gap-1" v-slot="$field">
				<label for="age" class="form-label">Tuổi</label>
				<InputNumber inputId="minmax" :min="0" :max="200" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="provinces" class="flex flex-col gap-1" v-slot="$field">
				<label for="provinces" class="form-label">Địa bàn hoạt động</label>
				<MultiSelect
					:options="provinces"
					optionLabel="name"
					placeholder="Chọn địa bàn hoạt động"
					class="w-full md:w-80"
				/>
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="facebook" class="flex flex-col gap-1" v-slot="$field">
				<label for="facebook" class="form-label">Facebook</label>
				<InputText type="text" placeholder="Nhập link facebook" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="zalo" class="flex flex-col gap-1" v-slot="$field">
				<label for="zalo" class="form-label">Zalo</label>
				<InputText type="number" placeholder="Nhập số zalo" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="education" class="flex flex-col gap-1" v-slot="$field">
				<label for="education" class="form-label">Học vấn</label>
				<InputText type="text" placeholder="Nhập học vấn" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="height" class="flex flex-col gap-1" v-slot="$field">
				<label for="height" class="form-label">Chiều cao</label>
				<InputNumber placeholder="Nhập chiều cao" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="weight" class="flex flex-col gap-1" v-slot="$field">
				<label for="weight" class="form-label">Cân nặng</label>
				<InputNumber placeholder="Nhập cân nặng" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>
		</Form>

		<!-- Guest booking MC editing form -->
		<Form
			v-if="editingMode == EditingMode.Update && !user.isMc"
			class="flex flex-col gap-4 w-full sm:w-56"
			:resolver="guestFormResolver"
			:initialValues="props.formInitialValues"
			@submit="onFormSubmit"
		>
			<div class="top">
				<Button
					type="button"
					severity="secondary"
					v-if="editingMode == EditingMode.Update"
					@click="cancelEditGeneralInfo"
					width="80px"
				>
					Hủy
				</Button>
				<Button v-if="editingMode == EditingMode.Update" type="submit"> Lưu </Button>
			</div>

			<FormField name="fullName" class="flex flex-col gap-1" v-slot="$field">
				<label for="fullName" class="form-label">Họ và tên</label>
				<InputText type="text" placeholder="Nhập họ và tên" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="description" class="flex flex-col gap-1" v-slot="$field">
				<label for="description" class="form-label">Mô tả về bản thân</label>
				<Textarea rows="5" cols="30" placeholder="Nhập mô tả về bản thân" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="facebook" class="flex flex-col gap-1" v-slot="$field">
				<label for="facebook" class="form-label">Facebook</label>
				<InputText type="text" placeholder="Nhập link facebook" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>

			<FormField name="zalo" class="flex flex-col gap-1" v-slot="$field">
				<label for="zalo" class="form-label">Zalo</label>
				<InputText type="number" placeholder="Nhập số zalo" />
				<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
					$field.error?.message
				}}</Message>
			</FormField>
		</Form>

		<div v-if="editingMode == EditingMode.None" class="general-info-wrapper">
			<!-- Show different fields based on whether user is MC or Guest -->
			<template v-if="user.isMc">
				<div class="info-item">
					<i class="icon pi pi-user-edit"></i>
					<div class="label">Nghệ danh</div>
					<div class="value line-clamp-3">{{ user.nickName }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-align-center"></i>
					<div class="label">Loại MC</div>
					<div class="value line-clamp-3">{{ mcTypesText }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-sparkles"></i>
					<div class="label">Phong cách dẫn</div>
					<div class="value line-clamp-3">{{ hostingStylesText }}</div>
				</div>
				<div v-if="user.isNewbie" class="info-item">
					<i class="icon pi pi-star"></i>
					<div class="label">MC mới</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-pen-to-square"></i>
					<div class="label">Mô tả về bản thân</div>
					<div class="value line-clamp-3">{{ user.description }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-mars"></i>
					<div class="label">Giới tính</div>
					<div class="value line-clamp-3">{{ getGenderText(user.gender) }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-clock"></i>
					<div class="label">Tuổi</div>
					<div class="value line-clamp-3">{{ user.age }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-map-marker"></i>
					<div class="label">Khu vực hoạt động</div>
					<div class="value line-clamp-3">{{ areasText }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-facebook"></i>
					<div class="label">Facebook</div>
					<div class="value line-clamp-3">
						<a :href="user.facebook" class="underline" target="_blank">{{ user.facebook }}</a>
					</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-link"></i>
					<div class="label">Zalo</div>
					<div class="value line-clamp-3">{{ user.zalo }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-graduation-cap"></i>
					<div class="label">Học vấn</div>
					<div class="value line-clamp-3">{{ user.education }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-angle-double-up"></i>
					<div class="label">Chiều cao</div>
					<div class="value line-clamp-3">{{ user.height }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-gauge"></i>
					<div class="label">Cân nặng</div>
					<div class="value line-clamp-3">{{ user.weight }}</div>
				</div>
			</template>
			<!-- Guest booking MC display -->
			<template v-else>
				<div class="info-item">
					<i class="icon pi pi-user"></i>
					<div class="label">Họ và tên</div>
					<div class="value line-clamp-3">{{ user.fullName }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-pen-to-square"></i>
					<div class="label">Mô tả về bản thân</div>
					<div class="value line-clamp-3">{{ user.description }}</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-facebook"></i>
					<div class="label">Facebook</div>
					<div class="value line-clamp-3">
						<a :href="user.facebook" class="underline" target="_blank">{{ user.facebook }}</a>
					</div>
				</div>
				<div class="info-item">
					<i class="icon pi pi-link"></i>
					<div class="label">Zalo</div>
					<div class="value line-clamp-3">{{ user.zalo }}</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { ref, computed } from "vue";
import { z } from "zod";
import { type User } from "@/entities/user/user";
import { getGenderDataSource, getGenderText } from "@/enums/gender";
import { EditingMode } from "@/enums/editingMode";
import { userApi } from "@/apis/userApi";
import { useRoute, useRouter } from "vue-router";
import { useHostingStyleStore } from "@/stores/hostingStyleStore";
import { useProvinceStore } from "@/stores/provinceStore";
import { useMcTypeStore } from "@/stores/mcTypeStore";
import { useEntity } from "@/composables/useEntity";
import type { HostingStyle } from "@/entities/hostingStyle";
import type { McType } from "@/entities/mcType";
import type { Province } from "@/entities/province";
import { useAuthStore } from "@/stores/authStore";

// Define component props
const props = defineProps<{
	formInitialValues: any;
}>();

const editingMode = defineModel<EditingMode>("editingMode", {
	default: EditingMode.None,
});

// user của profile hiện tại
const user = defineModel<User>("user", {
	default: () => ({
		isMc: true,
	}),
});

// Define events to emit
const emit = defineEmits<{
	(e: "submitted", values: any): void;
}>();

//#region Constants and Variables
const route = useRoute();
const userId = Number(route.params.id);
const authStore = useAuthStore();
const { updateEntityState } = useEntity();

// Split form resolvers for MC and guest users
const mcFormResolver = zodResolver(
	z.object({
		age: z.number().optional(),
		nickName: z.string().min(1, { message: "Không được bỏ trống" }),
		gender: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		education: z.string().nullable().optional(),
		height: z.any().nullable().optional(),
		weight: z.any().nullable().optional(),
		mcTypes: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		provinces: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		hostingStyles: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		facebook: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		// zalo: z.string().max(12, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		zalo: z.any().nullable().optional(),
		isNewbie: z.boolean().nullable(),
	})
);

const guestFormResolver = zodResolver(
	z.object({
		fullName: z.string().min(1, { message: "Không được bỏ trống" }),
		description: z.string().nullable().optional(),
		facebook: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		// zalo: z.string().max(12, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		zalo: z.any().nullable().optional(),
	})
);

const hostingStyleStore = useHostingStyleStore();
const hostingStyles = hostingStyleStore.hostingStyles;

const mcTypesStore = useMcTypeStore();
const mcTypes = mcTypesStore.mcTypes;

const provinceStore = useProvinceStore();
const provinces = provinceStore.provinces;

const genders = ref(getGenderDataSource());

/**
 * Formatted text of MC's hosting styles
 * Combines all hosting style labels into a comma-separated string
 */
const hostingStylesText = computed(() => {
	return user.value.hostingStyles?.map((style: HostingStyle) => style.label).join(", ") || "";
});

/**
 * Formatted text of MC types
 * Combines all MC type labels into a comma-separated string
 */
const mcTypesText = computed(() => {
	return user.value.mcTypes?.map((type: McType) => type.label).join(", ") || "";
});

/**
 * Formatted text of MC's operating areas
 * Combines all province names into a comma-separated string
 */
const areasText = computed(() => {
	return user.value.provinces?.map((province: Province) => province.name).join(", ") || "";
});

// const formInitialValues = ref({
// 	...user.value,
// });
//#endregion

//#region Profile Management
/**
 * Saves General Information Changes
 *
 * Handles the submission of general profile information updates:
 * - Updates user ID from route params
 * - Handles MC-specific entity state updates for related data
 * - Submits changes to backend
 * - Updates UI state and shows confirmation
 * - Refreshes user data
 *
 * @param {User} userSave - The user data to be saved
 * @returns {Promise<void>}
 * created by tqcong 20/5/2025.
 */
const handleSaveGeneralInfo = async (userSave: User) => {
	userSave.id = userId;

	// Handle details' entity state
	if (authStore.user?.isMc == "true") {
		userSave.mcTypes = updateEntityState(userSave.mcTypes, props.formInitialValues.mcTypes);
		userSave.hostingStyles = updateEntityState(userSave.hostingStyles, props.formInitialValues.hostingStyles);
		userSave.provinces = updateEntityState(userSave.provinces, props.formInitialValues.provinces);
	}

	const savedUser = await userApi.update(userId, userSave);

	editingMode.value = EditingMode.None;

	emit("submitted", savedUser);
};

const cancelEditGeneralInfo = () => {
	editingMode.value = EditingMode.None;
};

/**
 * Form Submission Handler
 *
 * Processes form submissions for both MC and guest user profiles:
 * - Validates form data before submission
 * - Handles saving profile information updates
 * - Processes different form types based on user role
 *
 * @param {Object} e - Form submission event object containing:
 *   - originalEvent: Native form submit event
 *   - valid: Form validation status
 *   - states: Current state of form fields
 *   - errors: Validation errors if any
 *   - values: Current form field values
 *   - reset: Form reset function
 * @returns {void}
 * created by tqcong 20/5/2025.
 */
const onFormSubmit = (e: any) => {
	if (e.valid) {
		handleSaveGeneralInfo(e.values);
	}
};
//#endregion
</script>

<style scoped lang="scss">
.tab-content-wrapper {
	margin-top: 12px;

	.top {
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		margin-bottom: 12px;
		align-items: center;
	}
}

.general-info-wrapper {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.info-item {
		display: flex;
		align-items: baseline;

		.label {
			width: 10rem;
			flex-shrink: 0;
			margin-left: 10px;
		}
		.value {
			font-size: 1.1rem;
			font-weight: 600;
		}
	}
}
</style>
