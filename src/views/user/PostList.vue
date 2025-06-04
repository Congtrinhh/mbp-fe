<template>
	<main class="main-container" @scroll="handleScroll" style="overflow-y: auto; max-height: 99vh">
		<header class="header">
			<div class="logo">{{ appName }}</div>
			<div class="tabs">
				<Chip
					v-for="group in groups"
					:key="group.value"
					:label="group.text"
					:class="{ active: group.value == activeGroup }"
					@click="activeGroup = group.value"
				/>
			</div>
			<div
				v-if="authStore.user && authStore.user.isMc == 'false'"
				class="create-post-button"
				@click="openPostDialog(EditingMode.Create)"
			>
				Đăng bài
			</div>
			<div v-else-if="!authStore.user">
				<span class="login-to-post-button" @click="handleLoginClick">Đăng nhập</span>
				&nbsp;để đăng bài, tương tác
			</div>
		</header>
		<Menu :model="postMenuItems" ref="postMenu" popup />

		<div class="post-list">
			<Card
				class="post-item"
				v-for="post in posts"
				:key="post.id"
				:pt="{
					body: {
						style: 'padding: 0',
					},
				}"
			>
				<template #header>
					<div class="post-header">
						<div class="avatar img-parent rounded">
							<img
								:src="post.user?.avatarUrl"
								alt="avatar"
								@click="redirectToProfile(post.user?.id ?? 0)"
							/>
						</div>
						<div class="info">
							<div class="name">{{ post.user?.fullName }}</div>
							<div class="time-ago" v-format-date:isRelativeNow="post.createdAt"></div>
						</div>
						<Button
							v-if="authStore.user?.id == post.userId"
							icon="pi pi-ellipsis-v"
							class="more-button p-button-text"
							severity="contrast"
							@click="handleShowPostMenu($event, post.id)"
						/>
					</div>
				</template>
				<template #content>
					<div class="post-content">
						<div class="show-info-item caption">{{ post.caption }}</div>
						<div class="show-info-item show-desc">
							<label class="title">Thông tin chương trình</label>
							<div class="content">{{ post.eventName }}</div>
						</div>
						<div class="show-info-item show-time">
							<label class="title">Thời gian</label>
							<div class="content">
								Từ <span class="font-medium" v-format-date="post.eventStart"></span> đến
								<span class="font-medium" v-format-date="post.eventEnd"></span>
							</div>
						</div>
						<div class="show-info-item show-place">
							<label class="title">Địa điểm</label>
							<div class="content">{{ post.place }}</div>
						</div>
						<div class="show-info-item show-requirement">
							<label class="title">Yêu cầu cho MC</label>
							<div class="content">{{ post.mcRequirement }}</div>
						</div>
						<div class="show-info-item show-cast" v-if="post.priceTo || post.priceFrom">
							<label class="title">Mức cát-xê</label>
							<div class="content">
								Từ <span class="font-medium">{{ formatCurrency(post.priceFrom) }}</span> đến
								<span class="font-medium">{{ formatCurrency(post.priceTo) }}</span>
							</div>
						</div>
					</div>
				</template>
				<template #footer>
					<div class="divider"></div>
					<div class="reaction-wrapper" v-if="post.reactions && post.reactions.length > 0">
						<div class="icon pi pi-thumbs-up-fill" style="color: var(--p-primary-400)"></div>
						<div class="info">{{ getReactionInfo(post.reactions) }}</div>
					</div>
					<div class="reaction-buttons" v-if="authStore.user">
						<div
							:class="[
								'reaction-button like-button',
								{
									liked: post.reactions && post.reactions.some((r) => r.userId == userId),
								},
							]"
							@click="toggleLikePost(post)"
						>
							<i
								:class="[
									'icon pi',
									post.reactions && post.reactions.some((r) => r.userId == userId)
										? 'pi-thumbs-up-fill'
										: 'pi-thumbs-up',
								]"
							></i>
							<span class="text">Thích</span>
						</div>
						<!-- nút nhắn tin -->
						<!-- <div class="reaction-button chat-button">
							<i class="icon pi pi-comment"></i>
							<span class="text">Nhắn tin</span>
						</div> -->
					</div>
				</template>
			</Card>
		</div>

		<Dialog
			v-if="isPostDialogVisible"
			v-model:visible="isPostDialogVisible"
			modal
			:pt="{
				header: {
					style: 'display: none',
				},
				root: {
					style: 'max-height: 100%;border-radius: 0;height: 100vh;',
				},
			}"
			@show="handleAfterShowDialog"
		>
			<ConfirmDialog></ConfirmDialog>
			<Form :resolver="formResolver" :initialValues="post" @submit="onFormSubmit">
				<div class="dialog-header">
					<Button icon="pi pi-times" class="escape-button" @click="closePostDialog(false)" />
					<span class="dialog-title">{{
						editingMode === EditingMode.Create ? "Tạo bài viết" : "Chỉnh sửa bài viết"
					}}</span>
					<Button label="Lưu" class="save-button" type="submit" />
				</div>
				<div class="form-body">
					<FormField v-slot="$field" name="caption" class="flex flex-col gap-1">
						<label for="caption" class="form-label">Caption</label>
						<InputText name="caption" placeholder="Nhập caption" v-model="post.caption" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="eventName" class="flex flex-col gap-1">
						<label for="eventName" class="form-label">Tên sự kiện</label>
						<InputText name="eventName" placeholder="Nhập tên sự kiện" v-model="post.eventName" />
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
								v-model="post.eventStart"
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
								v-model="post.eventEnd"
							/>
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</div>
					<FormField v-slot="$field" name="place" class="flex flex-col gap-1">
						<label for="place" class="form-label">Địa điểm</label>
						<InputText name="place" placeholder="Nhập địa điểm" v-model="post.place" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="mcRequirement" class="flex flex-col gap-1">
						<label for="mcRequirement" class="form-label">Yêu cầu MC</label>
						<TextArea name="mcRequirement" placeholder="Nhập yêu cầu MC" v-model="post.mcRequirement" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<div class="flex gap-4">
						<FormField v-slot="$field" name="priceFrom" class="flex flex-col gap-1 flex-1">
							<label for="priceFrom" class="form-label">Mức cát-xê từ (vnđ)</label>
							<InputNumber name="priceFrom" placeholder="Nhập giá từ" v-model="post.priceFrom" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
						<FormField v-slot="$field" name="priceTo" class="flex flex-col gap-1 flex-1">
							<label for="priceTo" class="form-label">Mức cát-xê đến (vnđ)</label>
							<InputNumber name="priceTo" placeholder="Nhập giá đến" v-model="post.priceTo" />
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</div>
				</div>
			</Form>
		</Dialog>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { EditingMode } from "@/enums/editingMode";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import type { Post } from "@/entities/user/post";
import BaseApi from "@/apis/baseApi";
import type { Reaction } from "@/entities/user/reaction";
import type { PostPagedRequest } from "@/entities/user/paging/postPagedRequest";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { useConfirm } from "primevue/useconfirm";
import { cloneDeep } from "lodash";
import { getPostGroupDataSource, PostGroup } from "@/enums/postGroup";
import { useAuthStore } from "@/stores/authStore";
import { useRedirect } from "@/composables/useRedirect";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import useFormatter from "@/composables/useFormatter";

const router = useRouter();

const authStore = useAuthStore();
const userId = authStore.user?.id || 0;
const confirm = useConfirm();

const postApi = BaseApi.getInstance<Post>("posts");
const { getItem, setItem, removeItem } = useLocalStorage();

const activeGroup = ref(PostGroup.Common);
const { redirectToProfile } = useRedirect();

const { formatCurrency } = useFormatter();

const toast = useToast();

const appStore = useAppStore();
const appName = appStore.appName;
//#region Form Data
/**
 * The defaultPost object represents a template for a Post with default values.
 *
 * This is useful for initializing a new Post object with default values to ensure
 * that all required fields are present and have a defined initial state.
 */
const defaultPost: Post = {
	id: 0,
	userId: 0,
	caption: "",
	eventName: "",
	eventStart: new Date(),
	eventEnd: new Date(),
	place: "",
	mcRequirement: "",
	priceFrom: 0,
	priceTo: 0,
};

const post = ref<Post>(cloneDeep(defaultPost));

/**
 * This is necessary to ensure that the initial post state is independent and does not share
 * references with the default post object.
 *
 * @type {Ref<Post>} - A reactive reference to a post object.
 */
const initialPost = ref<Post>(cloneDeep(defaultPost));

const formResolver = zodResolver(
	z
		.object({
			caption: z.string().optional(),
			eventName: z.string().min(1, { message: "Vui lòng nhập tên chương trình" }),
			eventStart: z.any().optional(),
			eventEnd: z.any().optional(),
			place: z.string().min(1, { message: "Vui lòng nhập địa điểm" }),
			mcRequirement: z.string().min(1, { message: "Vui lòng nhập yêu cầu cho MC" }),
			priceFrom: z.any().optional().nullable(),
			priceTo: z.any().optional().nullable(),
		})
		.refine(
			(data) => {
				if (data.eventStart && data.eventEnd) {
					return new Date(data.eventStart) < new Date(data.eventEnd);
				}
				if (!data.eventStart && !data.eventEnd) return true;
				if (!data.eventStart && data.eventEnd) return false;
				if (data.eventStart && !data.eventEnd) return false;
			},
			{ message: "Thời gian kết thúc phải sau thời gian bắt đầu", path: ["eventEnd"] }
		)
	// .refine(
	// 	(data) => {
	// 		console.trace(data);
	// 		if (data.priceFrom && data.priceTo) {
	// 			return data.priceFrom < data.priceTo;
	// 		}
	// 		if (!data.priceFrom && !data.priceTo) return true;
	// 		if (!data.priceFrom && data.priceTo) return false;
	// 		if (data.priceFrom && !data.priceTo) return false;
	// 	},
	// 	{ message: "Mức cát-xê đến phải lớn hơn mức cát-xê từ", path: ["priceTo"] }
	// )
);

const onFormSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;

	if (valid) {
		values.userId = userId;
		values.postGroup = activeGroup.value;
		await savePost(values);
	}
};
//#endregion

//#region Dialog Management
const isPostDialogVisible = ref(false);
const editingMode = ref<EditingMode>(EditingMode.Create);

const openPostDialog = async (mode: EditingMode) => {
	editingMode.value = mode;
	isPostDialogVisible.value = true;
};

const closePostDialog = async (isSave: boolean = false) => {
	if (isSave) {
		removeItem("post");
		post.value = cloneDeep(defaultPost);
		initialPost.value = cloneDeep(defaultPost);

		isPostDialogVisible.value = false;
		await loadPosts();
		return;
	}
	if (editingMode.value === EditingMode.Create) {
		if (JSON.stringify(post.value) !== JSON.stringify(initialPost.value)) {
			confirm.require({
				header: "Xác nhận thoát",
				message: "Dữ liệu đã được thay đổi, bạn có chắc muốn thoát không?",
				acceptProps: {
					label: "Thoát",
				},
				rejectProps: {
					label: "Lưu nháp",
					severity: "secondary",
					outlined: true,
				},
				accept: () => {
					removeItem("post");
					post.value = cloneDeep(defaultPost);
					initialPost.value = cloneDeep(defaultPost);

					isPostDialogVisible.value = false;
				},
				reject: () => {
					setItem("post", post.value);
					isPostDialogVisible.value = false;
				},
			});
		} else {
			isPostDialogVisible.value = false;
		}
	} else if (editingMode.value === EditingMode.Update) {
		if (JSON.stringify(post.value) !== JSON.stringify(initialPost.value)) {
			confirm.require({
				message: "Bạn có chắc muốn thoát không?",
				acceptLabel: "Thoát",
				rejectLabel: "Ở lại",
				accept: () => {
					isPostDialogVisible.value = false;
				},
			});
		} else {
			isPostDialogVisible.value = false;
		}
	}
};
//#endregion

//#region Post Management
const savePost = async (post: Post) => {
	if (editingMode.value == EditingMode.Update) {
		post.id = selectedPostId.value;
		await postApi.update(selectedPostId.value, post);
		toast.add({
			severity: "success",
			summary: "Đã tạo bài viết",
			detail: "Bài viết của bạn đã được cập nhật thành công",
			life: 3000,
		});
	} else if (editingMode.value == EditingMode.Create) {
		await postApi.create(post);
		toast.add({
			severity: "success",
			summary: "Đã tạo bài viết",
			detail: "Bài viết của bạn đã được tạo thành công",
			life: 3000,
		});
	}

	await closePostDialog(true);
};
//#endregion

//#region Post Data
const posts = ref<Post[]>([]);

const clearPosts = () => {
	posts.value = [];
};

const isLoading = ref(false);

const pagedRequest = ref<PostPagedRequest>({
	pageIndex: 0,
	pageSize: 10,
	isGetReaction: true,
	isUseProc: true,
	postGroup: activeGroup.value,
});

const loadMorePosts = async () => {
	if (isLoading.value) return;
	isLoading.value = true;

	pagedRequest.value.postGroup = activeGroup.value;
	const pagedResponse = await postApi.getPaged(pagedRequest.value);

	const newPosts = pagedResponse.items;
	posts.value.push(...newPosts);

	pagedRequest.value.pageIndex++;
	isLoading.value = false;
};

const handleScroll = (event: any) => {
	const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
	if (bottom) {
		loadMorePosts();
	}
};

const loadPosts = async () => {
	clearPosts();
	pagedRequest.value.pageIndex = 0;
	await loadMorePosts();
};

onMounted(async () => {
	await loadPosts();
});

const getReactionInfo = (reactions: any[]) => {
	if (reactions.length === 0) return "";

	const hasYou = reactions.some((r) => r.userId == userId);
	if (reactions.length === 1) {
		if (hasYou) return "Bạn";
		return reactions[0].userName;
	}

	if (hasYou) {
		return "Bạn và " + (reactions.length - 1) + " người khác";
	}

	return reactions[0].userName + " và " + (reactions.length - 1) + " người khác";
};
//#endregion

const groups = getPostGroupDataSource();

const reactionApi = BaseApi.getInstance<Reaction>("reactions");

/**
 * Toggles the like status of a post for the current user.
 * If the post is already liked by the user, it removes the like.
 * If the post is not liked by the user, it adds a like.
 *
 * @param {Post} post - The post object to toggle the like status for.
 * @returns {Promise<void>} - A promise that resolves when the like status has been toggled.
 */
const toggleLikePost = async (post: Post) => {
	// is liked
	const reaction = post.reactions.find((r: Reaction) => r.userId == userId);
	if (reaction) {
		post.reactions.splice(post.reactions.indexOf(reaction), 1);
		await reactionApi.delete(reaction.id, false);
	} else {
		const newReaction: Reaction = {
			postId: post.id,
			userId: userId,
			userName: authStore.user?.fullName || "",
			type: 0,
			id: 0,
		};
		post.reactions.push(newReaction);
		const createdReaction = await reactionApi.create(newReaction, false);
		newReaction.id = createdReaction.id;
	}
};

watch(
	() => activeGroup.value,
	async () => {
		await loadPosts();
	}
);

const handleAfterShowDialog = async () => {
	if (editingMode.value === EditingMode.Create) {
		const draftPost = getItem("post");
		if (draftPost) {
			post.value = draftPost;
			initialPost.value = cloneDeep(draftPost);
		}
	} else if (editingMode.value === EditingMode.Update) {
		const postId = post.value.id;
		const fetchedPost = await postApi.getById(postId);
		post.value = fetchedPost;
		initialPost.value = cloneDeep(fetchedPost);
	}
};

const handleLoginClick = () => {
	router.push({ name: "user-login", query: { redirect: router.currentRoute.value.fullPath } });
};

const postMenu = ref(null);
const selectedPostId = ref<number>(0);
const postMenuItems = [
	{ label: "Chỉnh sửa", icon: "pi pi-pencil", command: () => handleEditPost() },
	{ label: "Xóa", icon: "pi pi-trash", command: () => handleDeletePost() },
];

function handleShowPostMenu(event: Event, postId: number) {
	selectedPostId.value = postId;

	postMenu.value?.toggle(event);
}

async function handleEditPost() {
	try {
		const fetchedPost = await postApi.getById(selectedPostId.value);
		post.value = fetchedPost;
		initialPost.value = cloneDeep(fetchedPost);
		openPostDialog(EditingMode.Update);
	} catch (error) {
		toast.add({ severity: "error", summary: "Edit Error", detail: "Failed to fetch post", life: 3000 });
	}
}

async function handleDeletePost() {
	try {
		await postApi.delete(selectedPostId.value);
		await loadPosts();
		toast.add({ severity: "success", summary: "Delete", detail: "Successfully deleted post", life: 3000 });
	} catch (error) {
		toast.add({ severity: "error", summary: "Delete Error", detail: "Failed to delete post", life: 3000 });
	}
}
</script>
<style lang="scss" scoped>
.main-container {
	background: #dfdfdf;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

header.header {
	background: #fff;
	padding: 8px 16px;
	border-bottom: 1px solid #ddd;

	display: flex;
	flex-direction: column;
	align-items: flex-start;

	position: sticky;
	top: 0;
	z-index: 1;

	.logo {
		font-weight: bold;
		font-size: 1.3rem;
		margin-bottom: 12px;
	}
	.tabs {
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.create-post-button,
	.login-to-post-button {
		text-decoration: underline;
		cursor: pointer;
		font-weight: 500;
	}
}

.post-list {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.p-card.post-item {
	border-radius: 0;
	.post-header {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		padding: 16px 16px 0;

		.avatar {
			width: 40px;
			height: 40px;
		}
		.name {
			font-size: 1.1rem;
			font-weight: 500;
			margin-bottom: 2px;
		}
		.time-ago {
			font-size: 0.9rem;
		}
	}

	.post-content {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px 16px 0;
	}

	.reaction-wrapper {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-bottom: 14px;
		padding: 0 16px;
		margin-top: 12px;
	}

	.reaction-buttons {
		display: flex;
		align-items: center;
		gap: 36px;
		padding: 0 16px;
		margin-bottom: 12px;

		.reaction-button {
			display: flex;
			align-items: center;
			gap: 8px;
			cursor: pointer;

			.icon {
				font-size: 1.2rem;
			}
		}

		.reaction-button.like-button.liked {
			color: var(--p-primary-400);
		}
	}
}

.divider {
	height: 1px;
	background: #ddd;
	margin: 12px 0;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--p-dialog-header-padding) 0;
}

.dialog-title {
	font-size: 1.25rem;
	font-weight: bold;
}

.escape-button,
.save-button {
	background: none;
	border: none;
	cursor: pointer;
	color: #000;
}

.form-body {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.price-input {
	width: 1%;
}

.more-button {
	margin-left: auto;
}

.show-info-item {
	.title {
		font-weight: 500;
	}
}
.show-info-item.caption {
	font-size: 1.1rem;
	font-weight: 500;
}
</style>
