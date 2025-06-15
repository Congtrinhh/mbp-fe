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

/** * MC List View Component * * This component provides a searchable and filterable list of MCs (Master of Ceremonies).
* It implements infinite scrolling and advanced filtering capabilities for MC discovery. * * Key Features: * - Real-time
search functionality * - Advanced filtering options (age, gender, style, etc.) * - Infinite scroll pagination * -
Responsive grid layout * - Filter state management * * created by tqcong 20/5/2025. */

<script setup lang="ts">
/**
 * Core dependencies and types required for MC list functionality
 * created by tqcong 20/5/2025.
 */
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
import { debounce } from "lodash";
import type { UserPagedRequest } from "@/entities/user/paging/UserPagedRequest";
import { useAuthStore } from "@/stores/authStore";
import { isEqual } from "lodash";
import { useAppStore } from "@/stores/appStore";

/**
 * Filter Dialog State Management
 * Controls visibility of advanced filter dialog
 * created by tqcong 20/5/2025.
 */
const isVisibleFilterDialog = ref(false);
const showFilterDialog = () => {
	isVisibleFilterDialog.value = true;
};

const appStore = useAppStore();
const appName = appStore.appName;

/**
 * Form Configuration and Validation
 *
 * Sets up form validation rules and handling for the filter dialog.
 * Uses Zod schema validation to ensure data integrity.
 *
 * created by tqcong 20/5/2025.
 */
const toast = useToast();
const formRef = ref();

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

const onFormSubmit = (formInfo) => {
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

const genders = ref(getGenderDataSource());

const ageRange = ref([18, 80]);

const provinceStore = useProvinceStore();
const areas = ref(provinceStore.provinces);

const hostingStyleStore = useHostingStyleStore();
const hostingStyles = ref(hostingStyleStore.hostingStyles);

const mcTypeStore = useMcTypeStore();
const mcTypes = ref(mcTypeStore.mcTypes);

//#endregion

/**
 * Filter State Management
 *
 * Manages the filter state and provides reset functionality.
 * Default values are set for all filter parameters.
 *
 * created by tqcong 20/5/2025.
 */
const initialFilter = {
	searchText: "",
	genders: [],
	areas: [],
	hostingStyles: [],
	mcTypes: [],
	isNewbie: false,
	ageRange: [18, 80],
};

const filter = ref({ ...initialFilter });

const resetFilter = async () => {
	filter.value = { ...initialFilter };
	await nextTick();
	ageRange.value = [18, 80];
	searchText.value = "";
	// formRef.value.reset();
};
//#endregion

/**
 * Search Functionality
 *
 * Implements debounced search to prevent excessive API calls
 * while user is typing. Triggers data refresh when search
 * text changes.
 *
 * created by tqcong 20/5/2025.
 */
const searchText = ref("");
const debouncedSearchInput = debounce(() => {
	pagedRequest.pageIndex = 0;
	clearUsers();
	rebuildPagedRequest();
	loadMoreUsers();
}, 500);
//#endregion

/**
 * Pagination and Data Loading Logic
 *
 * Handles infinite scroll pagination and data loading:
 * - Maintains list of loaded users
 * - Manages loading state
 * - Handles scroll events for infinite loading
 * - Rebuilds request parameters based on filters
 *
 * created by tqcong 20/5/2025.
 */
const clearUsers = () => {
	users.value = [];
};

const isLoading = ref(false);

const rebuildPagedRequest = () => {
	pagedRequest.pageIndex = 0;

	const mcTypeIds = filter.value.mcTypes.map((mcType) => mcType.id).join(",");
	const hostingStyleIds = filter.value.hostingStyles.map((style) => style.id).join(",");
	const areaIds = filter.value.areas.map((area) => area.id).join(",");
	const genders = filter.value.genders.map((gender) => gender.code).join(",");

	const isNewbie = filter.value.isNewbie;

	const ageRange = filter.value.ageRange;

	pagedRequest = {
		...pagedRequest,
		nickName: searchText.value?.trim() || undefined,
		mcTypeIds: mcTypeIds || undefined,
		hostingStyleIds: hostingStyleIds || undefined,
		provinceIds: areaIds || undefined,
		genders: genders || undefined,
		isNewbie: isNewbie === true ? isNewbie : undefined,
		minAge: ageRange[0] || undefined,
		maxAge: ageRange[1] || undefined,
	};
};

/**
 * Loads additional users when scrolling
 *
 * This function:
 * 1. Checks if already loading to prevent duplicate requests
 * 2. Fetches next page of users based on current filters
 * 3. Appends new users to existing list
 * 4. Updates pagination state
 *
 * @returns {Promise<void>}
 * created by tqcong 20/5/2025.
 */
const loadMoreUsers = async () => {
	if (isLoading.value) return;
	isLoading.value = true;

	const pagedResponse = await userApi.getPaged(pagedRequest);

	const newUsers = pagedResponse.items;
	users.value.push(...newUsers);

	pagedRequest.pageIndex++;
	isLoading.value = false;
};

/**
 * Handles scroll events for infinite loading
 *
 * Detects when user has scrolled to bottom of the list
 * and triggers loading of more users if available.
 *
 * @param {Event} event - Scroll event object
 * created by tqcong 20/5/2025.
 */
const handleScroll = (event: any) => {
	console.log("even");
	const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
	if (bottom) {
		loadMoreUsers();
	}
};

let pagedRequest: UserPagedRequest = {
	pageIndex: 0,
	pageSize: 10,
	sort: "credit DESC",
	isMc: true,
	isGetMcType: true,
	isGetProvince: true,
	isUseProc: true,
};

const hasFilter = computed(() => !isEqual(filter.value, initialFilter));

const users = ref<User[]>([]);
onMounted(async () => {
	await loadMoreUsers();
});
//#endregion

/**
 * Navigation Handlers
 *
 * Functions for handling navigation events:
 * - Login redirection with return path
 * - MC profile navigation
 *
 * created by tqcong 20/5/2025.
 */
const router = useRouter();
const authStore = useAuthStore();

/**
 * Redirects to login page while preserving return path
 * created by tqcong 20/5/2025.
 */
const handleLoginClick = () => {
	router.push({ name: "user-login", query: { redirect: router.currentRoute.value.fullPath } });
};

/**
 * Navigates to specific MC's profile page
 *
 * @param {number} id - MC's unique identifier
 * created by tqcong 20/5/2025.
 */
const redirectToMC = (id: number) => {
	router.push({ name: "uc-mc", params: { id } });
};
//#endregion
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
