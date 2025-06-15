<template>
	<div class="reviews" @scroll="handleScroll">
		<div v-for="review in reviews" :key="review.id" class="review-item">
			<Card>
				<template #header>
					<div class="review-header">
						<template v-if="isMcReviewClient(review)">
							<img :src="review.mc?.avatarUrl" alt="mc avatar" class="client-avatar" />
							<div class="client-info">
								<div class="client-name">
									{{ review.mc?.nickName || review.mc?.fullName || "Unknown MC" }}
								</div>
								<div class="review-date">{{ formatDate(review.createdAt) }}</div>
							</div>
						</template>
						<template v-else>
							<img :src="review.client?.avatarUrl" alt="client avatar" class="client-avatar" />
							<div class="client-info">
								<div class="client-name">
									{{ review.client?.fullName || review.client?.nickName || "Unknown Client" }}
								</div>
								<div class="review-date">{{ formatDate(review.createdAt) }}</div>
							</div>
						</template>
					</div>
				</template>
				<template #content>
					<div class="review-body" :class="{ collapsed: review.collapsed }">
						<Rating v-model="review.overallPoint" readonly />
						<div class="event-name">{{ review.contract?.eventName }}</div>
						<div class="short-description mb-3">{{ review.shortDescription }}</div>
						<template v-if="isMcReviewClient(review)">
							<div class="payment-punctual-point-wrapper flex align-center justify-between">
								<div class="label">Thanh toán đúng hạn</div>
								<Rating v-model="review.paymentPunctualPoint" readonly />
							</div>
						</template>
						<template v-else>
							<div class="pro-point-wrapper flex align-center justify-between">
								<div class="label">Kỹ năng chuyên môn</div>
								<Rating v-model="review.proPoint" readonly />
							</div>
							<div class="attitude-point-wrapper flex align-center justify-between">
								<div class="label">Tinh thần thái độ</div>
								<Rating v-model="review.attitudePoint" readonly />
							</div>
						</template>
						<div class="reliable-point-wrapper flex align-center justify-between">
							<div class="label">Độ tin cậy</div>
							<Rating v-model="review.reliablePoint" readonly />
						</div>
						<p>{{ review.detailDescription }}</p>
					</div>
					<div v-if="review.collapsed" class="view-more-button" @click="review.collapsed = false">
						Xem thêm
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Rating from "primevue/rating";
import { clientReviewMcApi } from "../apis/clientReviewMcApi";
import { mcReviewClientApi } from "../apis/mcReviewClientApi";

// Props for the component
const props = defineProps<{
	userId: number;
	isMc: boolean;
}>();

// Interfaces for reviews
interface BaseReview {
	id: number;
	clientId?: number;
	mcId?: number;
	contractId?: number;
	shortDescription?: string;
	detailDescription: string;
	overallPoint: number;
	reliablePoint: number;
	createdAt: Date;
	collapsed: boolean;
	contract?: any;
	client?: any;
	mc?: any;
	entityState?: any;
}

interface ClientReviewWithType extends BaseReview {
	type: "ClientReviewMc";
	proPoint: number;
	attitudePoint: number;
}

interface McReviewWithType extends BaseReview {
	type: "McReviewClient";
	paymentPunctualPoint: number;
}

type ReviewWithType = ClientReviewWithType | McReviewWithType;

const reviews = ref<ReviewWithType[]>([]);
const reviewPage = ref(0);
const reviewPageSize = 10;
const hasMoreReviews = ref(true);
const isLoadingReviews = ref(false);

const toast = useToast();

// Helper function to format Date objects
const formatDate = (date: Date | string): string => {
	const d = new Date(date);
	return d.toLocaleDateString();
};

// Type guard for McReviewClient type
const isMcReviewClient = (review: ReviewWithType): review is McReviewWithType => {
	return review.type === "McReviewClient";
};

const fetchReviews = async () => {
	if (!hasMoreReviews.value || isLoadingReviews.value) return;

	isLoadingReviews.value = true;
	try {
		let response: { items: ReviewWithType[] } = { items: [] };
		if (props.isMc) {
			// Fetch reviews for MC
			const pagedRequest = {
				pageIndex: reviewPage.value,
				pageSize: reviewPageSize,
				mcId: props.userId,
				isUseProc: true,
				isGetContract: true,
				isGetMc: true,
				isGetClient: true,
			};
			const clientReviews = await clientReviewMcApi.getPaged(pagedRequest);
			response.items = clientReviews.items.map((item: any) => ({
				id: item.id,
				clientId: item.clientId,
				mcId: item.mcId,
				contractId: item.contractId,
				shortDescription: item.shortDescription,
				detailDescription: item.detailDescription,
				overallPoint: item.overallPoint,
				reliablePoint: item.reliablePoint,
				createdAt: item.createdAt,
				contract: item.contract,
				client: item.client,
				mc: item.mc,
				collapsed: true,
				type: "ClientReviewMc",
				proPoint: item.proPoint,
				attitudePoint: item.attitudePoint,
				entityState: item.entityState,
			}));
		} else {
			// Fetch reviews for Client
			const pagedRequest = {
				pageIndex: reviewPage.value,
				pageSize: reviewPageSize,
				clientId: props.userId,
				isUseProc: true,
				isGetContract: true,
				isGetMc: true,
				isGetClient: true,
			};
			const mcReviews = await mcReviewClientApi.getPaged(pagedRequest);
			response.items = mcReviews.items.map((item: any) => ({
				id: item.id,
				clientId: item.clientId,
				mcId: item.mcId,
				contractId: item.contractId,
				shortDescription: item.shortDescription,
				detailDescription: item.detailDescription,
				overallPoint: item.overallPoint,
				reliablePoint: item.reliablePoint,
				createdAt: item.createdAt,
				contract: item.contract,
				client: item.client,
				mc: item.mc,
				collapsed: true,
				type: "McReviewClient",
				paymentPunctualPoint: item.paymentPunctualPoint,
				entityState: item.entityState,
			}));
		}

		if (response.items.length < reviewPageSize) {
			hasMoreReviews.value = false;
		}

		reviews.value = [...reviews.value, ...response.items];
		reviewPage.value++;
	} catch (error) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Unable to load reviews",
			life: 3000,
		});
	} finally {
		isLoadingReviews.value = false;
	}
};

const handleScroll = (event: Event) => {
	const target = event.target as HTMLElement;
	if (target.scrollHeight - target.scrollTop === target.clientHeight) {
		fetchReviews();
	}
};

defineExpose({
	fetchReviews,
});
</script>

<style scoped lang="scss">
.reviews {
	max-height: 80vh;
	overflow-y: auto;
	padding-right: 16px;
}

.review-item {
	margin-bottom: 16px;
}

.review-header {
	display: flex;
	align-items: center;
	padding: var(--p-card-body-padding);
	padding-bottom: 0;
}

.client-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 12px;
	object-fit: cover;
}

.client-info {
	display: flex;
	flex-direction: column;
}

.client-name {
	font-weight: 500;
}

.review-date {
	font-size: 0.875rem;
	color: #888;
}

.review-body {
	margin-bottom: 12px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.review-body.collapsed {
	max-height: 50vh;
	overflow: hidden;
	position: relative;
}

.view-more-button {
	text-decoration: underline;
	cursor: pointer;
}
</style>
