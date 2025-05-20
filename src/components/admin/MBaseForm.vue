<!-- Base Form Component - Created by AI Assistant 30/04/2025 -->
<template>
	<Dialog
		:visible="modelValue"
		@update:visible="(value) => emit('update:modelValue', value)"
		:style="{ width: '600px' }"
		:modal="true"
		:closable="true"
		:closeOnEscape="true"
		:header="formTitle"
	>
		<!-- Content -->
		<div class="relative">
			<!-- Loading Overlay -->
			<div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
				<ProgressSpinner />
			</div>

			<!-- Form Content -->
			<Form
				v-slot="$form"
				:key="formData?.id || modelValue"
				:initialValues="formData"
				:resolver="resolver"
				:validateOnBlur="true"
				:validateOnMount="false"
				@submit="handleSubmit"
			>
				<div class="space-y-4">
					<div
						v-for="field in sortedFields"
						:key="field.key"
						v-show="!getEffectiveUIConfig(field).hidden"
						class="flex flex-col gap-1"
					>
						<label :for="field.key" class="block text-sm">
							{{ getEffectiveUIConfig(field).label }}
							<span v-if="isRequired(field)" class="text-red-600">*</span>
						</label>

						<!-- Text Input -->
						<InputText
							v-if="getEffectiveUIConfig(field).type === 'InputText'"
							:name="field.key"
							fluid
							v-model="formData[field.key]"
							:class="['w-full', { 'p-invalid': $form[field.key]?.invalid }]"
							:disabled="isDisabled || getEffectiveUIConfig(field).disabled"
							:readonly="mode === EditingMode.None || getEffectiveUIConfig(field).readonly"
						/>

						<!-- Select -->
						<Select
							v-else-if="getEffectiveUIConfig(field).type === 'Select'"
							:name="field.key"
							v-model="formData[field.key]"
							:options="getEffectiveUIConfig(field).props?.options"
							:optionValue="getEffectiveUIConfig(field).props?.optionValue || 'code'"
							:optionLabel="getEffectiveUIConfig(field).props?.optionLabel || 'name'"
							:placeholder="getEffectiveUIConfig(field).props?.placeholder"
							:class="['w-full', { 'p-invalid': $form[field.key]?.invalid }]"
							:disabled="isDisabled || getEffectiveUIConfig(field).disabled || mode === EditingMode.None"
						/>

						<!-- Checkbox -->
						<Checkbox
							v-else-if="getEffectiveUIConfig(field).type === 'Checkbox'"
							:name="field.key"
							v-model="formData[field.key]"
							:binary="true"
							:class="[{ 'p-invalid': $form[field.key]?.invalid }]"
							:disabled="isDisabled || getEffectiveUIConfig(field).disabled || mode === EditingMode.None"
						/>

						<!-- Textarea -->
						<Textarea
							v-else-if="getEffectiveUIConfig(field).type === 'Textarea'"
							:name="field.key"
							fluid
							v-model="formData[field.key]"
							v-bind="getEffectiveUIConfig(field).props || {}"
							:class="['w-full', { 'p-invalid': $form[field.key]?.invalid }]"
							:disabled="isDisabled || getEffectiveUIConfig(field).disabled"
							:readonly="mode === EditingMode.None || getEffectiveUIConfig(field).readonly"
						/>

						<Message v-if="$form[field.key]?.invalid" severity="error" size="small" variant="simple">
							{{ $form[field.key]?.error?.message }}
						</Message>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex justify-end gap-2 mt-4">
					<Button
						v-if="mode === EditingMode.None"
						label="Đóng"
						severity="secondary"
						@click="handleClose"
						:disabled="isDisabled"
						type="button"
					/>
					<template v-else>
						<Button
							label="Hủy"
							severity="secondary"
							@click="handleClose"
							:disabled="isDisabled"
							type="button"
						/>
						<Button
							:label="mode === EditingMode.Create ? 'Tạo mới' : 'Cập nhật'"
							severity="primary"
							:disabled="isDisabled || !$form.valid"
							type="submit"
						/>
					</template>
				</div>
			</Form>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import type { FormConfig, FieldConfig, FieldUIConfig } from "./MBaseForm.types";
import { formUtils } from "./MBaseForm.types";
import { EditingMode } from "../../enums/editingMode";
import { zodResolver } from "@primevue/forms/resolvers/zod"; // just type check error, ignore it

const toast = useToast();

const props = defineProps<{
	modelValue: boolean;
	mode: EditingMode;
	config: FormConfig;
	formData: Record<string, any>;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	"update:formData": [data: Record<string, any>];
	submitted: [data: Record<string, any>];
}>();

// State
const isLoading = ref(false);
const isDisabled = ref(false);

// Form resolver using zodResolver
const schema = formUtils.createSchema(props.config.fields);
const resolver = zodResolver(schema);

// Computed
const formTitle = computed(() => {
	switch (props.mode) {
		case EditingMode.Create:
			return "Thêm mới";
		case EditingMode.Update:
			return "Cập nhật";
		case EditingMode.None:
			return "Chi tiết";
		default:
			return "";
	}
});

const sortedFields = computed(() => {
	return [...props.config.fields].sort((a, b) => {
		const orderA = a.ui.order ?? Infinity;
		const orderB = b.ui.order ?? Infinity;
		return orderA - orderB;
	});
});

// Methods
function getEffectiveUIConfig(field: FieldConfig): FieldUIConfig {
	const modeKey = props.mode === EditingMode.None ? "view" : props.mode === EditingMode.Update ? "edit" : "add";
	const modeOverrides = props.config.modes?.[modeKey]?.[field.key];
	return { ...field.ui, ...(modeOverrides || {}) };
}

function isRequired(field: FieldConfig): boolean {
	return !field.schema.isOptional();
}

async function handleSubmit({ valid, values }: { valid: boolean; values: Record<string, any> }) {
	if (props.mode === EditingMode.None || !valid) {
		return;
	}

	try {
		isDisabled.value = true;
		isLoading.value = true;

		if (props.mode === EditingMode.Create) {
			await props.config.api.add(values);
		} else if (props.formData?.id) {
			await props.config.api.update(props.formData.id, values);
		}

		toast.add({
			severity: "success",
			summary: "Success",
			detail: props.mode === EditingMode.Create ? "Thêm mới thành công" : "Cập nhật thành công",
			life: 3000,
		});

		emit("submitted", values);
		handleClose();
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Đã có lỗi xảy ra",
			life: 3000,
		});
	} finally {
		isDisabled.value = false;
		isLoading.value = false;
	}
}

function handleClose() {
	emit("update:modelValue", false);
}

// Watches
watch(
	() => props.modelValue,
	async (newVal) => {
		if (newVal && props.mode !== EditingMode.Create && props.formData?.id) {
			try {
				isLoading.value = true;
				const data = await props.config.api.getById(props.formData.id);
				emit("update:formData", data);
			} catch (error) {
				toast.add({
					severity: "error",
					summary: "Error",
					detail: "Lỗi kết nối!",
					life: 3000,
				});
			} finally {
				isLoading.value = false;
			}
		}
	}
);
</script>

<style scoped>
.p-dialog-content {
	max-height: calc(90vh - 120px) !important;
	overflow-y: auto;
}
</style>
