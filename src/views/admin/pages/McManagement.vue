<!-- MC Management Page - Created by AI Assistant 30/04/2025 -->
<template>
	<div class="h-full flex flex-col">
		<ConfirmDialog />
		<h1 class="text-2xl font-semibold mb-4">MC Management</h1>

		<BaseList
			class="flex-1"
			:columns="columns"
			:actions="actions"
			:permissions="permissions"
			:loading="loading"
			:default-sort="{ field: 'modifiedAt', order: 'desc' }"
			:search-fields="['fullName', 'nickName', 'email']"
			:onLoad="handleLoadData"
			@row-dblclick="handleRowDblClick"
		>
			<!-- Status template -->
			<template #status="{ data }">
				<span
					:class="{
						'px-2 py-1 rounded text-sm font-medium': true,
						'bg-green-100 text-green-800': data.isVerified,
						'bg-yellow-100 text-yellow-800': !data.isVerified && data.isNewbie,
						'bg-red-100 text-red-800': !data.isVerified && !data.isNewbie,
					}"
				>
					{{ data.isVerified ? "Verified" : "Unverified" }}
				</span>
			</template>
		</BaseList>

		<!-- Form Dialog -->
		<MBaseForm
			v-model="showForm"
			:mode="formMode"
			:config="formConfig"
			:form-data="selectedMc"
			@update:form-data="selectedMc = $event"
			@submitted="handleFormSubmitted"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getGenderDataSource } from "@/enums/gender";
import ConfirmDialog from "primevue/confirmdialog";
import BaseList from "@/components/admin/BaseList.vue";
import type { ColumnDef, ActionConfig, ListParams } from "@/components/admin/types";
import { mcManagementApi } from "@/apis/mcManagementApi";
import { useToast } from "primevue/usetoast";
import type { User } from "@/entities/user/user";
import { z } from "zod";
import MBaseForm from "@/components/admin/MBaseForm.vue";
import type { FormConfig } from "@/components/admin/MBaseForm.types";
import { formUtils } from "@/components/admin/MBaseForm.types";
import { EditingMode } from "@/enums/editingMode";

const toast = useToast();
const loading = ref(false);
const showForm = ref(false);
const selectedMc = ref<Record<string, any>>({});
const formMode = ref(EditingMode.None);

// #region List

// Column definitions
const columns: ColumnDef[] = [
	{ field: "id", header: "ID", width: "80px" },
	{ field: "fullName", header: "Full Name", searchable: true },
	{ field: "nickName", header: "Nick Name", searchable: true },
	{ field: "email", header: "Email", searchable: true },
	{ field: "phoneNumber", header: "Phone Number", searchable: true },
	{ field: "credit", header: "Credit" },
	{ field: "status", header: "Status", template: "status" },
];

// Action configurations
const actions: ActionConfig[] = [
	{
		type: "view",
		icon: "pi pi-eye",
		tooltip: "View Details",
		permission: "mc:view",
		handler: (row: any) => handleView(row as User),
	},
	{
		type: "edit",
		icon: "pi pi-pencil",
		tooltip: "Edit MC",
		permission: "mc:edit",
		handler: (row: any) => handleEdit(row as User),
	},
	{
		type: "delete",
		icon: "pi pi-trash",
		tooltip: "Delete MC",
		permission: "mc:delete",
		confirmMessage: "Are you sure you want to delete this MC?",
		handler: (row: any) => handleDelete(row as User),
	},
];

// Data loading handler
const handleLoadData = async (params: ListParams) => {
	loading.value = true;
	try {
		return await mcManagementApi.getPaged(params);
	} catch (error) {
		throw error;
	} finally {
		loading.value = false;
	}
};

// Action handlers
const handleView = async (row: User) => {
	selectedMc.value = row;
	formMode.value = EditingMode.None;
	showForm.value = true;
};

const handleEdit = async (row: User) => {
	selectedMc.value = row;
	formMode.value = EditingMode.Update;
	showForm.value = true;
};

// Handle double-click event
const handleRowDblClick = (row: User) => {
	if (permissions.canEdit()) {
		handleEdit(row);
	} else if (permissions.canView()) {
		handleView(row);
	}
};

const handleDelete = async (row: User) => {
	try {
		await mcManagementApi.delete(row.id);
		toast.add({
			severity: "success",
			summary: "Success",
			detail: "MC deleted successfully",
			life: 3000,
		});
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Failed to delete MC",
			life: 3000,
		});
	}
};

// Mock permissions (replace with actual permission system)
const permissions = {
	canView: () => true,
	canEdit: () => true,
	canDelete: () => true,
	hasPermission: (permission: string) => true,
};

// #endregion

// #region Form
const formConfig = computed<FormConfig>(() => ({
	fields: [
		formUtils.createField("email", z.string().email("Email không hợp lệ"), {
			label: "Email",
			type: "InputText",
			order: 1,
		}),
		formUtils.createField("fullName", z.string().min(1, "Trường này là bắt buộc"), {
			label: "Họ tên",
			type: "InputText",
			order: 2,
		}),
		formUtils.createField("phoneNumber", z.string().min(1, "Trường này là bắt buộc"), {
			label: "Số điện thoại",
			type: "InputText",
			order: 3,
		}),
		formUtils.createField("facebook", z.string().nullable().optional(), {
			label: "Facebook",
			type: "InputText",
			order: 4,
		}),
		formUtils.createField("zalo", z.string().nullable().optional(), {
			label: "Zalo",
			type: "InputText",
			order: 5,
		}),
		formUtils.createField("gender", z.number().int(), {
			label: "Giới tính",
			type: "Select",
			props: {
				options: getGenderDataSource(),
				optionLabel: "name",
				optionValue: "code",
				placeholder: "Chọn giới tính",
			},
			order: 6,
		}),
		formUtils.createField("description", z.string().nullable().optional(), {
			label: "Mô tả",
			type: "Textarea",
			props: {
				rows: 3,
				autoResize: true,
			},
			order: 8,
		}),
	],
	api: mcManagementApi,
	modes: {
		view: {
			email: { readonly: true },
			fullName: { readonly: true },
			phoneNumber: { readonly: true },
			facebook: { readonly: true },
			zalo: { readonly: true },
			gender: { readonly: true },
			description: { readonly: true },
		},
	},
}));

function handleFormSubmitted() {
	toast.add({
		severity: "success",
		summary: "Success",
		detail: "Thao tác thành công",
		life: 3000,
	});
	showForm.value = false;

	// Refresh list
	handleLoadData({
		pageIndex: 0,
		pageSize: 50,
		sortField: "modifiedAt",
		sortOrder: "desc",
	});
}
// #endregion
</script>
