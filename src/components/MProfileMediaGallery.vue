<!--
Video/Image tab of the user profile with add/edit/delete/reorder items functionality.
-->
<template>
	<div>
		<!-- Editing Mode -->
		<div v-if="editingMode === EditingMode.Update" :class="updateWrapperClass">
			<div class="header">
				<Button icon="pi pi-arrow-left" @click="cancelEditMedia" class="back-button" />
				<h3 class="title">{{ updateTitle }}</h3>
			</div>
			<draggable v-model="medias" :class="listClass" @end="handleDragEnd" item-key="id" handle=".drag-handle">
				<template #item="{ element: media, index }">
					<div :class="itemClass">
						<i class="pi pi-bars drag-handle"></i>
						<template v-if="isImage">
							<img :src="media.url" alt="" class="thumbnail" />
						</template>
						<template v-else>
							<video :src="media.url" class="thumbnail" />
						</template>
						<div class="actions">
							<Button icon="pi pi-trash" @click="deleteMedia(index)" class="delete-button" />
						</div>
					</div>
				</template>
			</draggable>
			<Button :icon="addIcon" :label="addLabel" @click="onAddMediaClick" :class="addButtonClass" />
		</div>

		<!-- Gallery Mode -->
		<div v-else :class="galleryClass">
			<div
				v-for="(media, index) in sortedMedias"
				:key="media.id"
				class="gallery-item img-parent col-6"
				@click="openMediaViewer(index)"
			>
				<template v-if="isImage">
					<img :src="media.url" alt="" class="thumbnail" />
				</template>
				<template v-else>
					<video :src="media.url" class="thumbnail" />
				</template>
			</div>
		</div>
		<MMediaViewer
			v-model:visible="isMediaViewerVisible"
			:medias="sortedMedias"
			:initial-index="selectedMediaIndex"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import draggable from "vuedraggable";
import { useToast } from "primevue/usetoast";
import MMediaViewer from "@/components/MMediaViewer.vue";
import { mediaApi } from "@/apis/mediaApi";
import { userApi } from "@/apis/userApi";
import cloneDeep from "lodash/cloneDeep";
import { EditingMode } from "@/enums/editingMode";
import { MediaType } from "@/enums/mediaType";
import { EntityState } from "@/enums/entityState";
import type { Media } from "@/entities/user/media";

const props = defineProps<{
	mediaType: MediaType;
	userId: number;
}>();

// editingMode model to track the current editing state
const editingMode = defineModel<EditingMode>("editingMode", {
	default: EditingMode.None,
});

const toast = useToast();

const medias = ref<Media[]>([]);
const initialMedias = ref<Media[]>([]);
const isMediaViewerVisible = ref(false);
const selectedMediaIndex = ref(0);

const isImage = computed(() => props.mediaType === MediaType.Image);

const updateTitle = computed(() => (isImage.value ? "Chỉnh sửa ảnh" : "Chỉnh sửa video"));
const addLabel = computed(() => (isImage.value ? "Thêm ảnh" : "Thêm video"));
const addIcon = computed(() => "pi pi-plus");

// Class bindings for convenience
const updateWrapperClass = computed(() => (isImage.value ? "update-image-wrapper" : "update-video-wrapper"));
const listClass = computed(() => (isImage.value ? "image-list" : "video-list"));
const itemClass = computed(() => (isImage.value ? "image-item" : "video-item"));
const addButtonClass = computed(() => (isImage.value ? "add-image-button" : "add-video-button"));
const galleryClass = computed(() => "gallery row gx-2 gy-2");

const sortedMedias = computed(() => {
	return [...medias.value].sort((a, b) => b.sortOrder - a.sortOrder);
});

const fetchMedias = async (type?: MediaType) => {
	const fetched = await mediaApi.getMediasByUserId(props.userId, type ?? props.mediaType);
	medias.value = fetched;
	initialMedias.value = cloneDeep(fetched);
};

const deleteMedia = async (index: number) => {
	const mediaToDelete = medias.value[index];
	medias.value.splice(index, 1);
	await mediaApi.delete(mediaToDelete.id);
	toast.add({
		severity: "success",
		summary: isImage.value ? "Đã xóa ảnh thành công" : "Đã xóa video thành công",
		life: 3000,
	});
};

const handleDragEnd = async () => {
	medias.value.forEach((media, index) => {
		media.sortOrder = medias.value.length - index;
	});

	const payload = {
		id: props.userId,
		medias: medias.value.map((media) => ({
			...media,
			entityState: EntityState.Update,
		})),
	};

	await userApi.update(props.userId, payload);
	toast.add({
		severity: "success",
		summary: isImage.value ? "Đã sắp xếp lại ảnh thành công" : "Đã sắp xếp lại video thành công",
		life: 3000,
	});
};

const cancelEditMedia = () => {
	editingMode.value = EditingMode.None;
};

const onAddMediaClick = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = isImage.value ? "image/*,image/heic,image/heif" : "video/*,video/quicktime";
	input.onchange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			const newMedia: Media = {
				id: 0,
				userId: props.userId,
				type: props.mediaType,
				url: "",
				sortOrder: medias.value.length + 1,
				file: file,
				entityState: EntityState.Add,
			};
			await mediaApi.upload(newMedia);
			const updatedMedias = await mediaApi.getMediasByUserId(props.userId, props.mediaType);
			updatedMedias.forEach((item: Media) => {
				if (medias.value.every((i) => i.id !== item.id)) {
					medias.value.push(item);
				}
			});
			medias.value.sort((a, b) => b.sortOrder - a.sortOrder);
		}
	};
	input.click();
};

const openMediaViewer = (index: number) => {
	selectedMediaIndex.value = index;
	isMediaViewerVisible.value = true;
};

defineExpose({
	fetchMedias,
});
</script>

<style lang="scss" scoped>
.update-image-wrapper,
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
	}
}

.image-list,
.video-list {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.image-item,
	.video-item {
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

			.delete-button {
				background: none;
				border: none;
				cursor: pointer;
				color: #000;
			}
		}
	}
}

.add-image-button,
.add-video-button {
	width: 100%;
	margin-top: 24px;
}

.gallery-item {
	img {
		border-radius: 4px;
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
