<template>
	<main class="main-container">
		<Button
			icon="pi pi-pencil"
			class="edit-button"
			variant="text"
			raised
			rounded
			v-if="hasEditPermission && editingMode == EditingMode.None && activeTab != TabType.Review"
			@click="editingMode = EditingMode.Update"
		/>
		<section class="top">
			<div class="overview-info">
				<div class="avatar-wrapper">
					<div class="avatar img-parent rounded" @click="showAvatarMenu">
						<img :src="user.avatarUrl" alt="user avatar" />
					</div>
					<Menu :model="avatarMenuItems" ref="avatarMenu" popup />
				</div>
				<div class="info">
					<div class="name-wrapper">
						<div class="name">{{ user.isMc ? user.nickName : user.fullName }}</div>
						<span
							v-if="user.isVerified"
							class="pi pi-verified"
							style="font-size: 1.5rem; color: green"
						></span>
					</div>
					<div class="rating-info" v-if="user.reviewCount">
						<i class="pi pi-star-fill" style="color: #f59e0b"></i>
						<span class="rating-value">{{ user.avgRating }}</span>
						<span class="review-count">({{ user.reviewCount }})</span>
					</div>
				</div>
			</div>
			<div class="buttons">
				<Button
					type="button"
					label="Gửi offer"
					severity="primary"
					@click="openOfferDialog"
					v-if="!isLoggedUser && user.isMc && authStore.user?.isMc == 'false'"
				></Button>
				<Button
					type="button"
					label="Nhắn tin"
					severity="contrast"
					variant="outlined"
					v-if="!isLoggedUser && authStore.user"
				></Button>
				<Button
					type="button"
					label="Xác thực danh tính"
					severity="primary"
					@click="redirectToIdVerification"
					v-if="hasEditPermission && !user.isVerified"
				></Button>
			</div>
		</section>
		<section class="tabs">
			<Tabs value="0" @update:value="handleTabChange">
				<TabList>
					<Tab
						value="0"
						:pt="{
							root: {
								style: 'flex-grow: 1',
							},
						}"
						>Thông tin</Tab
					>
					<Tab
						v-if="user.isMc"
						value="1"
						:pt="{
							root: {
								style: 'flex-grow: 1',
							},
						}"
						>Ảnh</Tab
					>
					<Tab
						v-if="user.isMc"
						value="2"
						:pt="{
							root: {
								style: 'flex-grow: 1',
							},
						}"
						>Video</Tab
					>
					<Tab
						value="3"
						:pt="{
							root: {
								style: 'flex-grow: 1',
							},
						}"
						>Đánh giá</Tab
					>
				</TabList>
				<TabPanels>
					<TabPanel value="0">
						<MProfileGeneralInfo
							ref="profileGeneralInfoRef"
							v-model:editingMode="editingMode"
							v-model:user="user"
							:user-id="userId"
							:formInitialValues="formInitialValues"
							@submitted="handleSaveGeneralInfoSuccessful"
						/>
					</TabPanel>
					<TabPanel value="1">
						<MProfileMediaGallery
							ref="profileImageRef"
							v-model:editing-mode="editingMode"
							:media-type="MediaType.Image"
							:user-id="userId"
						/>
					</TabPanel>
					<TabPanel value="2">
						<MProfileMediaGallery
							ref="profileVideoRef"
							v-model:editing-mode="editingMode"
							:media-type="MediaType.Video"
							:user-id="userId"
						/>
					</TabPanel>
					<TabPanel value="3">
						<MProfileReview ref="profileReviewRef" :userId="user?.id" :isMc="user.isMc" />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</section>

		<!-- send event offer dialog -->
		<MSendOfferDialog
			v-model:isVisible="isOfferDialogVisible"
			:targetUserId="userId"
			@submitted="handleSendOfferSuccessful"
			@close="closeOfferDialog"
		/>

		<!-- avatar preview dialog -->
		<Dialog
			v-if="isAvatarDialogVisible"
			v-model:visible="isAvatarDialogVisible"
			modal
			:style="{ width: '100vw', height: '100vh' }"
		>
			<Image :src="user.avatarUrl" alt="user avatar" preview />
		</Dialog>
	</main>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { onMounted, ref, computed } from "vue";
import { type User } from "@/entities/user/user";
import { EditingMode } from "@/enums/editingMode";
import { userApi } from "@/apis/userApi";
import { useRoute } from "vue-router";
import { MediaType } from "@/enums/mediaType";
import { useAuthStore } from "@/stores/authStore";
import MSendOfferDialog from "@/components/MSendOfferDialog.vue";
import MProfileReview from "@/components/MProfileReview.vue";
import MProfileGeneralInfo from "@/components/MProfileGeneralInfo.vue";
import MProfileMediaGallery from "@/components/MProfileMediaGallery.vue";
import { useRedirect } from "@/composables/useRedirect";

//#region Constants and Variables
const toast = useToast();
const route = useRoute();
const userId = Number(route.params.id);
const routeTabIndex = Number(route.params.tabIndex);
const authStore = useAuthStore();
const { redirectToIdVerification } = useRedirect();

const profileReviewRef = ref<InstanceType<typeof MProfileReview>>();
const profileGeneralInfoRef = ref<InstanceType<typeof MProfileGeneralInfo>>();
const profileImageRef = ref<InstanceType<typeof MProfileMediaGallery>>();
const profileVideoRef = ref<InstanceType<typeof MProfileMediaGallery>>();

// user của profile hiện tại
const user = ref<User>({ isMc: true });

// có thể sửa profile hay ko
const hasEditPermission = computed(() => authStore.user!! && authStore.user.id == userId);

// có phải người đang login và người trong profile này là cùng 1 người hay ko
const isLoggedUser = computed(() => authStore.user!! && authStore.user.id == userId);

// mode chỉnh sửa hiện tại của tab profile/ảnh/video
const editingMode = ref<EditingMode>(EditingMode.None);
//#endregion

//#region Profile Management
// Initial form values (mc/client) for general info tab
const formInitialValues = ref({
	...user.value,
});
const handleSaveGeneralInfoSuccessful = async () => {
	toast.add({
		severity: "success",
		summary: "Đã lưu thông tin",
		detail: "Thông tin chung của bạn đã được lưu",
		life: 3000,
	});
	await setUser();
};

//#endregion

/**
 * Sets Current User Profile Data
 *
 * Fetches and updates the current profile's user data:
 * - Retrieves user information from API by ID
 * - Updates local user state
 * - Sets initial form values for editing
 *
 * @returns {Promise<void>}
 * created by tqcong 20/5/2025.
 */
const setUser = async () => {
	const userFromApi = await userApi.getById(userId);
	user.value = userFromApi;
	formInitialValues.value = {
		...userFromApi,
	};
};
onMounted(async () => {
	await setUser();
	if (routeTabIndex && routeTabIndex !== TabType.GeneralInfo) {
		// await handleTabChange({ index: routeTabIndex });
	}
});
//#endregion

//#region Tab Management
enum TabType {
	GeneralInfo = 0,
	Image = 1,
	Video = 2,
	Review = 3,
}

const activeTab = ref("0");

/**
 * Tab Change Handler
 *
 * Manages content loading when switching between tabs:
 * - Resets editing mode state
 * - Updates active tab
 * - Loads appropriate content based on tab type
 * - Handles MC-specific content loading for media tabs
 *
 * @param {number} value - The index of the selected tab
 * @returns {Promise<void>}
 * created by tqcong 20/5/2025.
 */
const handleTabChange = async (value: number) => {
	editingMode.value = EditingMode.None;

	activeTab.value = value.toString();
	if (value == TabType.GeneralInfo) {
		await setUser();
	} else if (value == TabType.Review) {
		await profileReviewRef.value?.fetchReviews();
	} else if (value == TabType.Image && user.value.isMc) {
		await profileImageRef.value?.fetchMedias(MediaType.Image);
	} else if (value == TabType.Video && user.value.isMc) {
		await profileVideoRef.value?.fetchMedias(MediaType.Video);
	}
};
//#endregion

//#region Send offer

/**
 * Dialog visibility state for the offer form
 */
const isOfferDialogVisible = ref(false);

const handleSendOfferSuccessful = () => {
	closeOfferDialog();
	toast.add({
		severity: "success",
		summary: "Đã gửi offer",
		detail: "Offer của bạn đã được gửi thành công",
		life: 3000,
	});
};

const closeOfferDialog = () => {
	isOfferDialogVisible.value = false;
};

const openOfferDialog = () => {
	isOfferDialogVisible.value = true;
};
//#endregion

//#region Avatar Management
/**
 * References for avatar menu and dialog functionality
 */
const avatarMenu = ref<{ toggle: (event: Event) => void } | null>(null);
const isAvatarDialogVisible = ref(false);

/**
 * Configuration for avatar menu items
 * Defines available actions for avatar manipulation:
 * - View full size avatar
 * - Upload new avatar
 */
const avatarMenuItems = [
	{
		label: "Xem ảnh đại diện",
		icon: "pi pi-eye",
		command: () => {
			isAvatarDialogVisible.value = true;
		},
	},
	{
		label: "Tải lên",
		icon: "pi pi-upload",
		command: () => {
			handleUploadAvatar();
		},
	},
];

/**
 * Shows the avatar menu when clicking on the avatar image
 * Only shows for users with edit permission
 * @param {Event} event - Click event object
 */
const showAvatarMenu = (event: any) => {
	if (hasEditPermission.value) {
		avatarMenu.value?.toggle(event);
	}
};

/**
 * Handles avatar image upload
 *
 * Opens file selection dialog and processes selected image:
 * - Validates file type
 * - Uploads to server
 * - Updates avatar URL in UI
 */
const handleUploadAvatar = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = async (event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			const response = await userApi.uploadAvatar(userId, file);
			user.value.avatarUrl = response.avatarUrl;
		}
	};
	input.click();
};

//#endregion
</script>

<style lang="scss" scoped>
section.top {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 16px 16px 24px;
	border-bottom: 1px solid #ccc;

	.overview-info {
		display: flex;
		align-items: center;
		gap: 16px;

		.rating-info {
			margin-top: 4px;
			font-size: 1.1rem;
			display: flex;
			align-items: center;
			gap: 6px;

			.rating-value {
				font-weight: 600;
			}

			.review-count {
				color: #999;
			}
		}

		.avatar {
			width: 80px;
			height: 80px;
			background-color: #dfdfdf;
		}

		.avatar-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			gap: 16px;
		}
	}
	.buttons {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.info {
		display: flex;
		flex-direction: column;

		.name-wrapper {
			display: flex;
			align-items: center;
			gap: 12px;

			.name {
				font-size: 1.25rem;
				font-weight: 700;
				flex-shrink: 0;
			}
		}
	}
}

.edit-button {
	position: fixed;
	bottom: 5rem;
	right: 2rem;
	background: #fff;
}
</style>
