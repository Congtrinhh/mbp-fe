<template>
	<main class="main-container background-1" @scroll="handleScroll" style="overflow-y: auto; max-height: 99vh">
		<header class="header">
			<div class="logo">{{ appName }}</div>
			<InputText
				v-model="searchText"
				placeholder="Tìm kiếm MC"
				class="search-input"
				@input="debouncedSearchInput"
			/>
			<div
				class="filter-button pi"
				:class="[hasFilter ? 'pi-filter-fill' : 'pi-filter']"
				@click="showFilterDialog"
			></div>
		</header>

		<div class="row gy-3">
			<div class="col-6" v-for="user in users" :key="user.id">
				<MMcItem :user="user" @click="redirectToMC(user.id)"></MMcItem>
			</div>
		</div>

		<Dialog v-model:visible="isVisibleFilterDialog" modal header="Tìm kiếm MC" :style="{ width: '96vw' }">
			<Form
				:resolver="resolver"
				:ref="formRef"
				@submit="onFormSubmit"
				:initialValues="filter"
				class="flex flex-col gap-4 w-full sm:w-56"
			>
				<FormField v-slot="$field" name="searchText" class="flex flex-col gap-1">
					<label for="searchText">Nghệ danh MC</label>
					<InputText v-model="searchText" placeholder="Nhập nghệ danh MC" class="w-full md:w-80" autofocus />
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="hostingStyles" class="flex flex-col gap-1">
					<label for="hostingStyles">Lối dẫn</label>
					<MultiSelect
						:options="hostingStyles"
						optionLabel="label"
						placeholder="Chọn lối dẫn"
						class="w-full md:w-80"
					/>
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="mcTypes" class="flex flex-col gap-1">
					<label for="mcTypes">Loại MC</label>
					<MultiSelect
						:options="mcTypes"
						optionLabel="label"
						placeholder="Chọn loại MC"
						class="w-full md:w-80"
					/>
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="areas" class="flex flex-col gap-1">
					<label for="areas">Khu vực hoạt động</label>
					<MultiSelect
						:options="areas"
						optionLabel="name"
						placeholder="Chọn khu vực"
						class="w-full md:w-80"
					/>
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="genders" class="flex flex-col gap-1">
					<label for="genders">Giới tính</label>
					<MultiSelect
						:options="genders"
						optionLabel="name"
						placeholder="Chọn giới tính"
						class="w-full md:w-56"
					/>
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="ageRange" class="flex flex-col gap-1">
					<label for="ageRange">Độ tuổi</label>

					<div class="flex items-center gap-5">
						<div>{{ ageRange[0] }}</div>
						<Slider v-model="ageRange" range class="age-slider" />
						<div>{{ ageRange[1] }}</div>
					</div>

					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<FormField v-slot="$field" name="isNewbie" class="flex gap-1">
					<Checkbox name="isNewbie" binary />
					<label for="isNewbie">Chỉ tìm MC mới vào nghề</label>
					<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
						$field.error?.message
					}}</Message>
				</FormField>

				<div class="flex justify-end gap-2">
					<Button
						type="button"
						label="Đặt lại"
						severity="secondary"
						@click="resetFilter"
						class="reset-button"
					></Button>
					<Button
						type="button"
						label="Hủy"
						severity="secondary"
						@click="isVisibleFilterDialog = false"
					></Button>
					<Button type="submit" severity="primary" label="Lọc" />
				</div>
			</Form>
		</Dialog>
	</main>
</template>

<script setup lang="ts">
import { userApi } from "@/apis/userApi";
import type { User } from "@/entities/user/user";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, nextTick, computed } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { useProvinceStore } from "@/stores/provinceStore";
import { useMcTypeStore } from "@/stores/mcTypeStore";
import { useHostingStyleStore } from "@/stores/hostingStyleStore";
import { getGenderDataSource } from "@/enums/gender";
import InputText from "primevue/inputtext";
import { debounce, isEqual } from "lodash";
import type { UserPagedRequest } from "@/entities/user/paging/UserPagedRequest";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";

//#region Constants and Store Initialization
const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();
const appName = appStore.appName;
const formRef = ref();

// Store initializations
const provinceStore = useProvinceStore();
const hostingStyleStore = useHostingStyleStore();
const mcTypeStore = useMcTypeStore();

// Form validation schema
const resolver = zodResolver(
	z.object({
		searchText: z.string().optional(),
		hostingStyles: z.array(z.any()),
		mcTypes: z.array(z.any()),
		areas: z.array(z.any()),
		genders: z.array(z.any()),
		ageRange: z.array(z.number()),
		isNewbie: z.boolean(),
	})
);

// Initial filter state
const initialFilter = {
	searchText: "",
	genders: [],
	areas: [],
	hostingStyles: [],
	mcTypes: [],
	isNewbie: false,
	ageRange: [18, 80],
};
//#endregion

//#region State Management
const isVisibleFilterDialog = ref(false);
const isLoading = ref(false);
const searchText = ref("");
const users = ref<User[]>([]);
const ageRange = ref([18, 80]);

// Data sources
const areas = ref(provinceStore.provinces);
const hostingStyles = ref(hostingStyleStore.hostingStyles);
const mcTypes = ref(mcTypeStore.mcTypes);
const genders = ref(getGenderDataSource());

// Filter states
const filter = ref({ ...initialFilter });
const hasFilter = computed(() => !isEqual(filter.value, initialFilter));

let pagedRequest: UserPagedRequest = {
	pageIndex: 0,
	pageSize: 10,
	sort: "credit DESC",
	isMc: true,
	isGetMcType: true,
	isGetProvince: true,
	isUseProc: true,
};
//#endregion

//#region Form Operations
const onFormSubmit = (formInfo: any) => {
	const { valid, values } = formInfo;
	if (valid) {
		filter.value = values;
		clearUsers();
		rebuildPagedRequest();
		loadMoreUsers();
		toast.add({ severity: "success", summary: "Đã áp dụng bộ lọc", life: 3000 });
		isVisibleFilterDialog.value = false;
	}
};

const resetFilter = async () => {
	filter.value = { ...initialFilter };
	await nextTick();
	ageRange.value = [18, 80];
	searchText.value = "";
};

const showFilterDialog = () => {
	isVisibleFilterDialog.value = true;
};
//#endregion

//#region Data Loading
const clearUsers = () => {
	users.value = [];
};

const loadMoreUsers = async () => {
	if (isLoading.value) return;
	isLoading.value = true;

	const pagedResponse = await userApi.getPaged(pagedRequest);
	const newUsers = pagedResponse.items;
	users.value.push(...newUsers);

	pagedRequest.pageIndex++;
	isLoading.value = false;
};

const debouncedSearchInput = debounce(() => {
	pagedRequest.pageIndex = 0;
	clearUsers();
	rebuildPagedRequest();
	loadMoreUsers();
}, 500);

const rebuildPagedRequest = () => {
	pagedRequest.pageIndex = 0;

	const mcTypeIds = filter.value.mcTypes?.map((mcType: any) => mcType.id).join(",");
	const hostingStyleIds = filter.value.hostingStyles?.map((style: any) => style.id).join(",");
	const areaIds = filter.value.areas?.map((area: any) => area.id).join(",");
	const genderCodes = filter.value.genders?.map((gender: any) => gender.code).join(",");

	const isNewbie = filter.value.isNewbie;
	const currentAgeRange = filter.value.ageRange;

	pagedRequest = {
		...pagedRequest,
		nickName: searchText.value?.trim() || undefined,
		mcTypeIds: mcTypeIds || undefined,
		hostingStyleIds: hostingStyleIds || undefined,
		provinceIds: areaIds || undefined,
		genders: genderCodes || undefined,
		isNewbie: isNewbie === true ? isNewbie : undefined,
		minAge: currentAgeRange?.[0] || undefined,
		maxAge: currentAgeRange?.[1] || undefined,
	};
};

const handleScroll = (event: any) => {
	const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
	if (bottom) {
		loadMoreUsers();
	}
};
//#endregion

//#region Navigation
const handleLoginClick = () => {
	router.push({ name: "user-login", query: { redirect: router.currentRoute.value.fullPath } });
};

const redirectToMC = (id: number) => {
	router.push({ name: "uc-mc", params: { id } });
};
//#endregion

onMounted(async () => {
	await loadMoreUsers();
});
</script>

<style lang="scss" scoped>
.main-container {
	padding: 0 12px 12px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 72px;
	padding: 0 4px;
	background: #fff;

	.logo {
		font-size: 1.3rem;
		font-weight: bold;
	}

	.search-input {
		flex: 1;
		margin: 0 18px 0 30px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.filter-button {
		cursor: pointer;
		flex-shrink: 0;
		width: 40px;
		display: flex;
		justify-content: center;
	}
}

.reset-button {
	margin-right: auto;
}

.age-slider {
	width: 70%;
	flex: 1;
}
</style>
