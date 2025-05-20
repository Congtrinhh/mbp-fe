<template>
	<main class="main-container">
		<header class="center-header">Tin nhắn</header>
		<div class="main-content">
			<div class="search-container">
				<IconField>
					<InputIcon class="pi pi-search" />
					<InputText v-model="value1" placeholder="Tìm kiếm" />
				</IconField>
			</div>
			<div class="message-list">
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview line-clamp-1">
							abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc
						</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview line-clamp-1">
							abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc
						</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview">abc</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
				<div class="message-item">
					<div class="avatar">
						<img src="https://picsum.photos/200" alt="" />
					</div>
					<div class="info-container">
						<div class="name">Trịnh Quý Công</div>
						<div class="message-preview line-clamp-1">
							abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc
						</div>
						<div class="time-ago">1 giờ trước</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const value1 = ref("");
</script>

<style lang="scss" scoped>
.main-container {
	// padding: 0 12px 12px;
}

.message-list {
	display: flex;
	flex-direction: column;
}

.message-item {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 8px 16px;

	.avatar {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}
	.info-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		position: relative;

		.name {
			margin-bottom: 6px;
			font-size: 1.1rem;
		}

		.time-ago {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.message-preview {
			max-width: 160px;
			text-overflow: ellipsis;
			display: inline-block;
		}
	}
}

.search-container {
	padding: 16px 12px 16px;
}

.p-inputicon {
	color: #000;
	font-size: 1.2rem;
}

.p-inputtext {
	border-radius: 8px;
	background-color: #f6f6f6;
	height: 32px;
	width: 100%;
	border-color: transparent;
}
</style>
