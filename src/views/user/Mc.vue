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
					@click="toVerifyIdentityView"
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
						<div v-if="editingMode == EditingMode.Update" class="update-image-wrapper">
							<div class="header">
								<Button icon="pi pi-arrow-left" @click="cancelEditImages" class="back-button" />
								<h3 class="title">Chỉnh sửa ảnh</h3>
							</div>
							<draggable
								v-model="images"
								class="image-list"
								@end="handleDragEnd"
								item-key="id"
								handle=".drag-handle"
							>
								<template #item="{ element: image, index }">
									<div class="image-item">
										<i class="pi pi-bars drag-handle"></i>
										<img :src="image.url" alt="" class="thumbnail" />
										<div class="actions">
											<Button
												icon="pi pi-trash"
												@click="deleteImage(index)"
												class="delete-button"
											/>
										</div>
									</div>
								</template>
							</draggable>
							<Button
								icon="pi pi-plus"
								label="Thêm ảnh"
								@click="onAddImageClick"
								class="add-image-button"
							/>
						</div>
						<div v-else class="gallery row gx-2 gy-2">
							<div
								class="gallery-item img-parent col-6"
								v-for="(image, index) in sortedImages"
								:key="image.id"
								@click="openImageViewer(index)"
							>
								<img :src="image.url" alt="" />
							</div>
						</div>
						<MMediaViewer
							v-model:visible="isImageViewerVisible"
							:medias="sortedImages"
							:initial-index="selectedImageIndex"
						/>
					</TabPanel>
					<TabPanel value="2">
						<div v-if="editingMode == EditingMode.Update" class="update-video-wrapper">
							<div class="header">
								<Button icon="pi pi-arrow-left" @click="cancelEditVideos" class="back-button" />
								<h3 class="title">Chỉnh sửa video</h3>
							</div>
							<draggable
								v-model="videos"
								class="video-list"
								@end="handleVideoDragEnd"
								item-key="id"
								handle=".drag-handle"
							>
								<template #item="{ element: video, index }">
									<div class="video-item">
										<i class="pi pi-bars drag-handle"></i>
										<video :src="video.url" class="thumbnail" />
										<div class="actions">
											<Button
												icon="pi pi-trash"
												@click="deleteVideo(index)"
												class="delete-button"
											/>
										</div>
									</div>
								</template>
							</draggable>
							<Button
								icon="pi pi-plus"
								label="Thêm video"
								@click="onAddVideoClick"
								class="add-video-button"
							/>
						</div>
						<div v-else class="gallery row gx-2 gy-2">
							<div
								class="gallery-item img-parent col-6"
								v-for="(video, index) in sortedVideos"
								:key="video.id"
								@click="openVideoViewer(index)"
							>
								<video :src="video.url" class="thumbnail" />
							</div>
						</div>
						<MMediaViewer
							v-model:visible="isVideoViewerVisible"
							:medias="sortedVideos"
							:initial-index="selectedVideoIndex"
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
import cloneDeep from "lodash/cloneDeep";
import { type User } from "@/entities/user/user";
import { EditingMode } from "@/enums/editingMode";
import { userApi } from "@/apis/userApi";
import { useRoute, useRouter } from "vue-router";
import { mediaApi } from "@/apis/mediaApi";
import type { Media } from "@/entities/user/media";
import { MediaType } from "@/enums/mediaType";
import { EntityState } from "@/enums/entityState";
import { useAuthStore } from "@/stores/authStore";
import MMediaViewer from "@/components/MMediaViewer.vue";
import MSendOfferDialog from "@/components/MSendOfferDialog.vue";
import MProfileReview from "@/components/MProfileReview.vue";
import draggable from "vuedraggable";
import MProfileGeneralInfo from "@/components/MProfileGeneralInfo.vue";

//#region Constants and Variables
const toast = useToast();
const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);
const routeTabIndex = Number(route.params.tabIndex);
const authStore = useAuthStore();

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

//#region Media Management
const images = ref<Media[]>([]);
const initialImages = ref<Media[]>([]);

/**
 * Sorted list of images by sort order (descending)
 * Creates a new sorted array to maintain reactivity
 */
const sortedImages = computed(() => {
	return [...images.value].sort((a, b) => b.sortOrder - a.sortOrder);
});

const deleteImage = async (index: number) => {
	const imageToDelete = images.value[index];
	images.value.splice(index, 1);
	await mediaApi.delete(imageToDelete.id);
	toast.add({ severity: "success", summary: "Đã xóa ảnh thành công", life: 3000 });
};

const handleDragEnd = async () => {
	// Reassign sort orders based on new positions
	images.value.forEach((image, index) => {
		image.sortOrder = images.value.length - index;
	});

	// Prepare payload with all updated images
	const payload = {
		id: userId,
		medias: images.value.map((image) => ({
			...image,
			entityState: EntityState.Update,
		})),
	};

	// Update in backend
	await userApi.update(userId, payload);
	toast.add({ severity: "success", summary: "Đã sắp xếp lại ảnh thành công", life: 3000 });
};

const cancelEditImages = () => {
	editingMode.value = EditingMode.None;
};

const fetchImages = async () => {
	const imagesFromApi = await mediaApi.getMediasByUserId(userId, MediaType.Image);
	images.value = imagesFromApi;
	initialImages.value = cloneDeep(imagesFromApi);
};

const onAddImageClick = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*,image/heic,image/heif";
	input.onchange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			try {
				const file = target.files[0];
				const newMedia: Media = {
					id: 0, // Assuming the backend will generate the ID
					userId: userId,
					type: MediaType.Image,
					url: "",
					sortOrder: images.value.length + 1,
					file: file, // Include the file to upload
					entityState: EntityState.Add,
				};

				const response = await mediaApi.upload(newMedia);

				const updatedMedias = await mediaApi.getMediasByUserId(userId, MediaType.Image);
				updatedMedias.forEach((item: Media) => {
					if (images.value.every((i) => i.id != item.id)) {
						images.value.push(item);
					}
				});
				//sort images by sortorder descending
				images.value.sort((a, b) => b.sortOrder - a.sortOrder);
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		}
	};
	input.click();
};
//#endregion

//#region Video Tab Panel Logic
const videos = ref<Media[]>([]);
const initialVideos = ref<Media[]>([]);

/**
 * Sorted list of videos by sort order (descending)
 * Creates a new sorted array to maintain reactivity
 */
const sortedVideos = computed(() => {
	return [...videos.value].sort((a, b) => b.sortOrder - a.sortOrder);
});

const deleteVideo = async (index: number) => {
	const videoToDelete = videos.value[index];
	videos.value.splice(index, 1);
	await mediaApi.delete(videoToDelete.id);
	toast.add({ severity: "success", summary: "Đã xóa video thành công", life: 3000 });
};

const handleVideoDragEnd = async () => {
	// Reassign sort orders based on new positions
	videos.value.forEach((video, index) => {
		video.sortOrder = videos.value.length - index;
	});

	// Prepare payload with all updated videos
	const payload = {
		id: userId,
		medias: videos.value.map((video) => ({
			...video,
			entityState: EntityState.Update,
		})),
	};

	// Update in backend
	await userApi.update(userId, payload);
	toast.add({ severity: "success", summary: "Đã sắp xếp lại video thành công", life: 3000 });
};

const cancelEditVideos = () => {
	editingMode.value = EditingMode.None;
};

const fetchVideos = async () => {
	const videosFromApi = await mediaApi.getMediasByUserId(userId, MediaType.Video);
	videos.value = videosFromApi;
	initialVideos.value = cloneDeep(videosFromApi);
};

const onAddVideoClick = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "video/*,video/quicktime";
	input.onchange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			const newMedia: Media = {
				id: 0, // Assuming the backend will generate the ID
				userId: userId,
				type: MediaType.Video,
				url: "",
				sortOrder: videos.value.length + 1,
				file: file, // Include the file to upload
				entityState: EntityState.Add,
			};

			const response = await mediaApi.upload(newMedia);

			const updatedMedias = await mediaApi.getMediasByUserId(userId, MediaType.Video);
			updatedMedias.forEach((item: Media) => {
				if (videos.value.every((i) => i.id != item.id)) {
					videos.value.push(item);
				}
			});
			//sort videos by sortorder descending
			videos.value.sort((a, b) => b.sortOrder - a.sortOrder);
		}
	};
	input.click();
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
		await fetchImages();
	} else if (value == TabType.Video && user.value.isMc) {
		await fetchVideos();
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
			handleUpload();
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
const handleUpload = () => {
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

//#region Image Viewer
/**
 * State for image viewer modal
 */
const isImageViewerVisible = ref(false);
const selectedImageIndex = ref(0);

/**
 * Opens the image viewer modal at specified index
 * @param {number} index - Index of image to display
 */
const openImageViewer = (index: number) => {
	selectedImageIndex.value = index;
	isImageViewerVisible.value = true;
};
// #endregion

//#region Video Viewer
/**
 * State for video viewer modal
 */
const isVideoViewerVisible = ref(false);
const selectedVideoIndex = ref(0);

/**
 * Opens the video viewer modal at specified index
 * @param {number} index - Index of video to display
 */
const openVideoViewer = (index: number) => {
	selectedVideoIndex.value = index;
	isVideoViewerVisible.value = true;
};
// #endregion

//#region Navigation
/**
 * Navigate to the identity verification view
 */
const toVerifyIdentityView = () => {
	router.push({
		name: "user-identity-verification",
	});
};
// #endregion

const profileReviewRef = ref<InstanceType<typeof MProfileReview>>();
const profileGeneralInfoRef = ref<InstanceType<typeof MProfileGeneralInfo>>();
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

			.verify-identity {
				text-decoration: underline;
				cursor: pointer;
			}
		}
	}
}

//anh & video
.gallery-item {
	img {
		border-radius: 4px;
	}
}

.edit-button {
	position: fixed;
	bottom: 5rem;
	right: 2rem;
	background: #fff;
}

.update-image-wrapper {
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-bottom: 16px;

		.back-button {
			position: absolute;
			left: 0;
		}

		.title {
			font-size: 1.5rem;
			font-weight: bold;
		}

		.save-button {
			position: absolute;
			right: 0;
		}
	}

	.image-list {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.image-item {
			display: flex;
			align-items: center;
			gap: 16px;

			.thumbnail {
				width: 80px;
				height: 80px;
				object-fit: cover;
				border-radius: 4px;
			}

			.actions {
				margin-left: auto;
				display: flex;
				gap: 8px;

				.delete-button,
				.move-up-button,
				.move-down-button {
					background: none;
					border: none;
					cursor: pointer;
					color: #000;
				}
			}
		}
	}

	.add-image-button {
		width: 100%;
		margin-top: 24px;
	}
}

.update-image-wrapper {
	display: flex;
	flex-direction: column;
}

.update-video-wrapper {
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-bottom: 16px;

		.back-button {
			position: absolute;
			left: 0;
		}

		.title {
			font-size: 1.5rem;
			font-weight: bold;
		}

		.save-button {
			position: absolute;
			right: 0;
		}
	}

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.video-item {
			display: flex;
			align-items: center;
			gap: 16px;

			.thumbnail {
				width: 80px;
				height: 80px;
				object-fit: cover;
			}

			.actions {
				margin-left: auto;
				display: flex;
				gap: 8px;

				.delete-button,
				.move-up-button,
				.move-down-button {
					background: none;
					border: none;
					cursor: pointer;
					color: #000;
				}
			}
		}
	}

	.add-video-button {
		width: 100%;
		margin-top: 24px;
	}
}

.drag-handle {
	cursor: move;
	padding: 8px;
	color: #666;

	&:hover {
		color: #000;
	}
}

.thumbnail {
	width: 100%;
	height: auto;
	object-fit: cover;
	cursor: pointer;
}
</style>
