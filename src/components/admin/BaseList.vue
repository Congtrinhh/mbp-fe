<template>
	<div class="base-list flex flex-col h-full">
		<!-- Search Box -->
		<div class="mb-3 toolbar">
			<div class="w-1/4 search-container">
				<IconField>
					<InputIcon class="pi pi-search" />
					<InputText
						v-model="searchTerm"
						placeholder="Search..."
						class="w-full"
						@update:modelValue="handleSearch"
					/>
				</IconField>
			</div>
			<div class="right-buttons">
				<Button icon="pi pi-refresh" tooltip="Refresh" @click="handleRefresh" />
			</div>
		</div>

		<!-- Data Table -->
		<DataTable
			class="flex-1"
			:value="data"
			:loading="isLoading"
			:paginator="true"
			:rows="rows"
			:rows-per-page-options="rowsPerPageOptions"
			:first="first"
			:total-records="totalRecords"
			:lazy="true"
			:sortField="sortField"
			:sortOrder="sortOrder"
			:pt="{
				pcPaginator: {
					root: {
						style: 'justify-content: flex-start;',
					},
				},
			}"
			responsive-layout="scroll"
			striped-rows
			scrollable
			scrollHeight="flex"
			@page="handlePageChange"
			@sort="handleSort"
			@row-click="handleRowClick"
			@row-dblclick="handleRowDblClick"
		>
			<!-- Dynamic Columns -->
			<Column
				v-for="col in columns"
				:key="col.field"
				:field="col.field"
				:header="col.header"
				:sortable="col.sortable !== false"
				:style="col.width ? { width: col.width } : undefined"
			>
				<template #body="slotProps" v-if="col.template">
					<slot :name="col.template" :data="slotProps.data" />
				</template>
			</Column>

			<!-- Actions Column -->
			<Column v-if="actions?.length" header="Actions" :style="{ width: '120px' }" :exportable="false">
				<template #body="slotProps">
					<div class="flex gap-2">
						<Button
							v-for="action in actions"
							:key="action.type"
							:icon="action.icon"
							:tooltip="action.tooltip"
							:disabled="!!(action.permission && !permissions?.hasPermission(action.permission))"
							link
							@click="handleAction(action, slotProps.data)"
						/>
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import type { BaseEntity, ColumnDef, ActionConfig, ListParams, ListResponse } from "./types";
import type { DataTableSortEvent } from "primevue/datatable";
import Column from "primevue/column";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const props = withDefaults(
	defineProps<{
		columns: ColumnDef[];
		actions?: ActionConfig[];
		defaultSort?: { field: string; order: "asc" | "desc" };
		searchFields?: string[];
		pageSize?: number;
		permissions?: {
			canView: () => boolean;
			canEdit: () => boolean;
			canDelete: () => boolean;
			hasPermission: (permission: string) => boolean;
		};
		loading?: boolean;
		onLoad?: (params: ListParams) => Promise<ListResponse<BaseEntity>>; // will call getPaged method of AdminBaseApi
	}>(),
	{
		pageSize: 50,
		loading: false,
	}
);

const emit = defineEmits<{
	"update:modelValue": [value: BaseEntity[]];
	"row-click": [row: BaseEntity];
	"row-dblclick": [row: BaseEntity];
	error: [error: Error];
}>();

// Component state
const data = ref<BaseEntity[]>([]);
const totalRecords = ref(0);
const first = ref(0);
const rows = ref(props.pageSize);
const rowsPerPageOptions = [5, 10, 20, 50, 100];
const sortField = ref(props.defaultSort?.field);
const sortOrder = ref<1 | -1>(props.defaultSort?.order === "desc" ? -1 : 1);
const searchTerm = ref("");
const isLoading = ref(props.loading);

// Services
const confirm = useConfirm();
const toast = useToast();

// Methods
const loadData = async () => {
	if (!props.onLoad) return;

	isLoading.value = props.loading ?? true;

	try {
		const params: ListParams = {
			pageIndex: Math.floor(first.value / rows.value),
			pageSize: rows.value,
			sortField: sortField.value,
			sortOrder: sortOrder.value === 1 ? "asc" : "desc",
			search: searchTerm.value,
			searchFields: props.searchFields,
		};

		const result = await props.onLoad(params);
		data.value = result.items;
		totalRecords.value = result.totalCount;
	} catch (error) {
		emit("error", error as Error);
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Failed to load data",
			life: 3000,
		});
	} finally {
		if (props.loading === undefined) {
			isLoading.value = false;
		}
	}
};

const handleSort = (event: DataTableSortEvent) => {
	if (typeof event.sortField === "string") {
		sortField.value = event.sortField;
	}
	const newSortOrder = event.sortOrder as 1 | -1 | 0;
	if (newSortOrder !== 0) {
		sortOrder.value = newSortOrder;
	}
	loadData();
};

const handlePageChange = (event: { first: number; rows: number }) => {
	first.value = event.first;
	rows.value = event.rows;
	loadData();
};

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const handleSearch = debounce(() => {
	first.value = 0;
	loadData();
}, 500);

const handleRefresh = () => {
	first.value = 0;
	rows.value = props.pageSize;
	loadData();
};

const handleRowClick = (event: { data: BaseEntity }) => {
	if (props.permissions?.canView?.()) {
		emit("row-click", event.data);
	}
};

const handleRowDblClick = (event: { data: BaseEntity }) => {
	if (props.permissions?.canView?.() || props.permissions?.canEdit?.()) {
		emit("row-dblclick", event.data);
	}
};

const handleAction = (action: ActionConfig, row: BaseEntity) => {
	if (action.permission && !props.permissions?.hasPermission(action.permission)) {
		return;
	}

	if (action.confirmMessage) {
		confirm.require({
			message: action.confirmMessage,
			header: "Confirmation",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				action.handler?.(row);
			},
		});
	} else {
		action.handler?.(row);
	}
};

const initDefault = () => {
	//init default actions column with view, edit and delete
};

// Watch for loading prop changes
watchEffect(() => {
	if (props.loading !== undefined) {
		isLoading.value = props.loading;
	}
});

// Initial load
onMounted(() => {
	initDefault();

	loadData();
});
</script>

<style scoped>
.base-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: calc(
		100vh - 137px
	); /* Account for app header (56px) + page padding (32px) + page title (28px) + margin (21px) */
	overflow: hidden;
}

.base-list :deep(.p-datatable) {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0; /* Important for Firefox */
}

.base-list :deep(.p-datatable-wrapper) {
	flex: 1;
	min-height: 0; /* Important for Firefox */
}

.search-container {
	min-width: 250px;
}

.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
