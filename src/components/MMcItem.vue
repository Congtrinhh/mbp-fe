<script setup lang="ts">
import type { McType } from "@/entities/mcType";
import type { Province } from "@/entities/province";
import type { User } from "@/entities/user/user";
import { Gender } from "@/enums/gender";
import { computed, withDefaults } from "vue";

interface Props {
	user: User;
}
const props = withDefaults(defineProps<Props>(), {
	user: () => ({
		id: 0,
		fullName: "",
		email: "",
		phoneNumber: "",
		isMc: false,
		age: undefined,
		nickName: "",
		avgRating: undefined,
		reviewCount: undefined,
		gender: Gender.Male,
		isNewbie: false,
		workingArea: "",
		isVerified: false,
		description: "",
		education: "",
		height: undefined,
		weight: undefined,
		avatarUrl: "",
		facebook: "",
		zalo: "",
		medias: [],
		mcTypes: [],
		provinces: [],
		hostingStyles: [],
	}),
});

const mcTypes = computed(() => props.user.mcTypes.map((type: McType) => type.label).join(", "));
const provinces = computed(() => props.user.provinces.map((province: Province) => province.name).join(", "));
</script>

<template>
	<div class="m-mc-container">
		<div class="m-img-container">
			<img :src="props.user.avatarUrl" alt="user avatar" />
		</div>
		<div class="m-desc-container">
			<div class="m-labels-container">
				<div v-if="props.user.reviewCount" class="rating">
					<i class="pi pi-star-fill" style="color: #f59e0b"></i>
					<span class="rating-value">{{ props.user.avgRating }}</span>
					<span class="review-count">({{ props.user.reviewCount }})</span>
				</div>
				<Tag v-if="props.user.isNewbie" value="Mới"></Tag>
			</div>
			<strong class="m-mc-name">{{ props.user.nickName }}</strong>
			<div class="m-mc-address line-clamp-1">{{ provinces }}</div>
			<div class="m-mc-types line-clamp-1">{{ mcTypes }}</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.m-mc-container {
	border-radius: 6px;
	border: 1px solid #e2e2e2;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: #fff;

	.m-img-container {
		img {
			min-width: 100%;
		}
	}

	.m-desc-container {
		padding: 10px 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;

		.m-mc-name {
			font-weight: bold;
		}

		.rating {
			display: flex;
			align-items: baseline;
			gap: 4px;

			.pi-star-fill {
				color: #f59e0b;
			}

			.rating-value {
				font-weight: 600;
			}

			.review-count {
				color: #999;
			}
		}
	}

	.m-labels-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
}
</style>
