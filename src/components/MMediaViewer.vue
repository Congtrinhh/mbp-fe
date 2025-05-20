<template>
	<div class="media-viewer" v-if="visible">
		<div
			class="swiper-container"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd"
		>
			<div class="swiper-wrapper" :style="{ transform: `translateY(${translateY}px)` }">
				<div v-for="(media, index) in medias" :key="media.id" class="swiper-slide">
					<img v-if="media.type === MediaType.Image" :src="media.url" alt="" />
					<div
						v-if="media.type === MediaType.Video"
						class="video-container"
						@click="toggleVideo(index, $event)"
					>
						<video
							:ref="(el) => (videoRefs[index] = el)"
							:src="media.url"
							:loop="true"
							playsinline
							@timeupdate="updateProgress(index)"
							@loadedmetadata="setDuration(index)"
							style="object-fit: cover; width: 100%; height: 100%"
						></video>
						<div class="video-overlay" v-if="!isPlaying[index]">
							<i class="pi pi-play play-icon"></i>
						</div>
						<!-- Progress Bar -->
						<div
							class="progress-bar-container"
							@mousedown="startSeek(index, $event)"
							@touchstart="startSeek(index, $event)"
						>
							<div class="progress-bar" :style="{ width: `${progress[index]}%` }"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button class="close-button" @click="close">
			<i class="pi pi-times"></i>
		</button>
		<div class="media-counter">{{ currentIndex + 1 }} / {{ medias.length }}</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import type { Media } from "@/entities/user/media";
import { MediaType } from "@/enums/mediaType";

const props = defineProps<{
	visible: boolean;
	medias: Media[];
	initialIndex: number;
}>();

const emit = defineEmits<{
	(e: "update:visible", value: boolean): void;
}>();

const currentIndex = ref(props.initialIndex);
const translateY = ref(0);
const touchStart = ref(0);
const touchMove = ref(0);
const videoRefs = ref<Array<HTMLVideoElement | null>>([]);
const isPlaying = ref<boolean[]>([]);
const progress = ref<number[]>([]);
const wasVideoClicked = ref(true);

watch(
	() => props.visible,
	(newValue) => {
		if (newValue) {
			document.body.style.overflow = "hidden";
			nextTick(() => {
				const currentVideo = videoRefs.value[currentIndex.value];
				if (currentVideo) {
					currentVideo.play();
					isPlaying.value[currentIndex.value] = true;
				}
			});
		} else {
			document.body.style.overflow = "auto";
		}
	}
);

watch(currentIndex, (newVal, oldVal) => {
	const oldVid = videoRefs.value[oldVal];
	const newVid = videoRefs.value[newVal];
	if (oldVid) {
		oldVid.pause();
		isPlaying.value[oldVal] = false;
	}
	if (newVid) {
		newVid.play();
		isPlaying.value[newVal] = true;
	}
});

const close = () => {
	emit("update:visible", false);
};

const handleTouchStart = (e: TouchEvent) => {
	touchStart.value = e.touches[0].clientY;
};

const handleTouchMove = (e: TouchEvent) => {
	touchMove.value = e.touches[0].clientY;
	const diff = touchMove.value - touchStart.value;
	if (Math.abs(diff) < window.innerHeight) {
		translateY.value = diff;
	}
};

const handleTouchEnd = () => {
	if (wasVideoClicked.value) {
		wasVideoClicked.value = false;
		return;
	}
	const diff = touchMove.value - touchStart.value;
	const threshold = window.innerHeight * 0.2; // 20% of screen height

	if (Math.abs(diff) > threshold) {
		if (diff > 0 && currentIndex.value > 0) {
			// Swipe down, show previous media
			currentIndex.value--;
		} else if (diff < 0 && currentIndex.value < props.medias.length - 1) {
			// Swipe up, show next media
			currentIndex.value++;
		}
	}

	// Animate to the current media
	translateY.value = -currentIndex.value * window.innerHeight;
	touchStart.value = 0;
	touchMove.value = 0;
};

const toggleVideo = (index: number, evt: Event) => {
	evt.stopPropagation();
	wasVideoClicked.value = true;
	const vid = videoRefs.value[index];

	videoRefs.value.forEach((v) => v?.pause());

	if (!vid) return;
	if (vid.paused) {
		vid.play();
		isPlaying.value[index] = true;
	} else {
		vid.pause();
		isPlaying.value[index] = false;
	}
};

const updateProgress = (index: number) => {
	const vid = videoRefs.value[index];
	if (vid) {
		progress.value[index] = (vid.currentTime / vid.duration) * 100;
	}
};

const setDuration = (index: number) => {
	const vid = videoRefs.value[index];
	if (vid) {
		progress.value[index] = (vid.currentTime / vid.duration) * 100;
	}
};

/**
 * bắt đầu action kéo thả tua video
 * @param index
 * @param event
 */
const startSeek = (index: number, event: MouseEvent | TouchEvent) => {
	const vid = videoRefs.value[index];
	if (!vid) return;

	const seek = (e: MouseEvent | TouchEvent) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const seekTime = ((clientX - rect.left) / rect.width) * vid.duration;
		vid.currentTime = seekTime;
		updateProgress(index);
	};

	const stopSeek = () => {
		document.removeEventListener("mousemove", seek);
		document.removeEventListener("mouseup", stopSeek);
		document.removeEventListener("touchmove", seek);
		document.removeEventListener("touchend", stopSeek);
	};

	document.addEventListener("mousemove", seek);
	document.addEventListener("mouseup", stopSeek);
	document.addEventListener("touchmove", seek);
	document.addEventListener("touchend", stopSeek);

	seek(event);
};
</script>

<style lang="scss" scoped>
.media-viewer {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.9);
	z-index: 1000;
}

.swiper-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.swiper-wrapper {
	transition: transform 0.3s ease-out;
}

.swiper-slide {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;

	img,
	video {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
}

.close-button {
	position: absolute;
	top: 20px;
	right: 20px;
	background: none;
	border: none;
	color: white;
	font-size: 24px;
	cursor: pointer;
	z-index: 1001;

	&:hover {
		opacity: 0.8;
	}
}

.media-counter {
	position: absolute;
	top: 20px;
	left: 20px;
	color: white;
	font-size: 16px;
	z-index: 1001;
}

.video-container {
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;

	.video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 2rem;
		pointer-events: none;
	}

	.play-icon {
		font-size: 4rem;
	}

	.progress-bar-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 5px;
		background: rgba(255, 255, 255, 0.3);
		cursor: pointer;
	}

	.progress-bar {
		height: 100%;
		background: #fff;
		width: 0;
	}
}
</style>
