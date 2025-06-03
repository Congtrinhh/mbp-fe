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
					@click="sendOffer"
					v-if="!isLoggedUser && user.isMc && authStore.user?.isMc == 'false'"
				></Button>
				<!-- <Button
					type="button"
					label="Nhắn tin"
					severity="contrast"
					variant="outlined"
					v-if="!isLoggedUser && authStore.user"
				></Button> -->
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
						<div class="tab-content-wrapper">
							<!-- MC editing form - keeps all original fields -->
							<Form
								v-if="editingMode == EditingMode.Update && user.isMc"
								class="flex flex-col gap-4 w-full sm:w-56"
								:resolver="mcFormResolver"
								:initialValues="formInitialValues"
								@submit="onFormSubmit"
							>
								<div class="top">
									<Button
										type="button"
										severity="secondary"
										v-if="editingMode == EditingMode.Update"
										@click="cancelEditGeneralInfo"
										width="80px"
									>
										Hủy
									</Button>
									<Button v-if="editingMode == EditingMode.Update" type="submit"> Lưu </Button>
								</div>

								<FormField name="nickName" class="flex flex-col gap-1" v-slot="$field">
									<label for="nickName" class="form-label">Nghệ danh</label>
									<InputText type="text" placeholder="Nhập nghệ danh" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>
								<FormField name="mcTypes" class="flex flex-col gap-1" v-slot="$field">
									<label for="mcTypes" class="form-label">Loại MC</label>
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
								<FormField name="hostingStyles" class="flex flex-col gap-1" v-slot="$field">
									<label for="hostingStyles" class="form-label">Phong cách dẫn</label>
									<MultiSelect
										:options="hostingStyles"
										optionLabel="label"
										placeholder="Chọn phong cách dẫn"
										class="w-full md:w-80"
									/>
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="isNewbie" class="flex flex-col gap-1" v-slot="$field">
									<label for="isNewbie" class="form-label">MC mới</label>
									<Checkbox inputId="isNewbie" name="isNewbie" binary />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="description" class="flex flex-col gap-1" v-slot="$field">
									<label for="description" class="form-label">Mô tả về bản thân</label>
									<Textarea rows="5" cols="30" placeholder="Nhập mô tả về bản thân" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="gender" class="flex flex-col gap-1" v-slot="$field">
									<label for="gender" class="form-label">Giới tính</label>
									<Select
										:options="genders"
										option-label="name"
										option-value="code"
										placeholder="Chọn giới tính"
										class="w-full md:w-56"
									/>
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="age" class="flex flex-col gap-1" v-slot="$field">
									<label for="age" class="form-label">Tuổi</label>
									<InputNumber inputId="minmax" :min="0" :max="200" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="provinces" class="flex flex-col gap-1" v-slot="$field">
									<label for="provinces" class="form-label">Địa bàn hoạt động</label>
									<MultiSelect
										:options="provinces"
										optionLabel="name"
										placeholder="Chọn địa bàn hoạt động"
										class="w-full md:w-80"
									/>
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="facebook" class="flex flex-col gap-1" v-slot="$field">
									<label for="facebook" class="form-label">Facebook</label>
									<InputText type="text" placeholder="Nhập link facebook" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="zalo" class="flex flex-col gap-1" v-slot="$field">
									<label for="zalo" class="form-label">Zalo</label>
									<InputText type="text" placeholder="Nhập số zalo" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="education" class="flex flex-col gap-1" v-slot="$field">
									<label for="education" class="form-label">Học vấn</label>
									<InputText type="text" placeholder="Nhập học vấn" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="height" class="flex flex-col gap-1" v-slot="$field">
									<label for="height" class="form-label">Chiều cao</label>
									<InputNumber placeholder="Nhập chiều cao" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="weight" class="flex flex-col gap-1" v-slot="$field">
									<label for="weight" class="form-label">Cân nặng</label>
									<InputNumber placeholder="Nhập cân nặng" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>
							</Form>

							<!-- Guest booking MC editing form -->
							<Form
								v-if="editingMode == EditingMode.Update && !user.isMc"
								class="flex flex-col gap-4 w-full sm:w-56"
								:resolver="guestFormResolver"
								:initialValues="formInitialValues"
								@submit="onFormSubmit"
							>
								<div class="top">
									<Button
										type="button"
										severity="secondary"
										v-if="editingMode == EditingMode.Update"
										@click="cancelEditGeneralInfo"
										width="80px"
									>
										Hủy
									</Button>
									<Button v-if="editingMode == EditingMode.Update" type="submit"> Lưu </Button>
								</div>

								<FormField name="fullName" class="flex flex-col gap-1" v-slot="$field">
									<label for="fullName" class="form-label">Họ và tên</label>
									<InputText type="text" placeholder="Nhập họ và tên" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="description" class="flex flex-col gap-1" v-slot="$field">
									<label for="description" class="form-label">Mô tả về bản thân</label>
									<Textarea rows="5" cols="30" placeholder="Nhập mô tả về bản thân" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="facebook" class="flex flex-col gap-1" v-slot="$field">
									<label for="facebook" class="form-label">Facebook</label>
									<InputText type="text" placeholder="Nhập link facebook" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>

								<FormField name="zalo" class="flex flex-col gap-1" v-slot="$field">
									<label for="zalo" class="form-label">Zalo</label>
									<InputText type="text" placeholder="Nhập số zalo" />
									<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
										$field.error?.message
									}}</Message>
								</FormField>
							</Form>

							<div v-if="editingMode == EditingMode.None" class="general-info-wrapper">
								<!-- Show different fields based on whether user is MC or Guest -->
								<template v-if="user.isMc">
									<div class="info-item">
										<i class="icon pi pi-user-edit"></i>
										<div class="label">Nghệ danh</div>
										<div class="value line-clamp-3">{{ user.nickName }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-align-center"></i>
										<div class="label">Loại MC</div>
										<div class="value line-clamp-3">{{ mcTypesText }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-sparkles"></i>
										<div class="label">Phong cách dẫn</div>
										<div class="value line-clamp-3">{{ hostingStylesText }}</div>
									</div>
									<div v-if="user.isNewbie" class="info-item">
										<i class="icon pi pi-star"></i>
										<div class="label">MC mới</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-pen-to-square"></i>
										<div class="label">Mô tả về bản thân</div>
										<div class="value line-clamp-3">{{ user.description }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-mars"></i>
										<div class="label">Giới tính</div>
										<div class="value line-clamp-3">{{ getGenderText(user.gender) }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-clock"></i>
										<div class="label">Tuổi</div>
										<div class="value line-clamp-3">{{ user.age }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-map-marker"></i>
										<div class="label">Khu vực hoạt động</div>
										<div class="value line-clamp-3">{{ areasText }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-facebook"></i>
										<div class="label">Facebook</div>
										<div class="value line-clamp-3">
											<a :href="user.facebook" class="underline" target="_blank">{{
												user.facebook
											}}</a>
										</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-link"></i>
										<div class="label">Zalo</div>
										<div class="value line-clamp-3">{{ user.zalo }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-graduation-cap"></i>
										<div class="label">Học vấn</div>
										<div class="value line-clamp-3">{{ user.education }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-angle-double-up"></i>
										<div class="label">Chiều cao</div>
										<div class="value line-clamp-3">{{ user.height }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-gauge"></i>
										<div class="label">Cân nặng</div>
										<div class="value line-clamp-3">{{ user.weight }}</div>
									</div>
								</template>
								<!-- Guest booking MC display -->
								<template v-else>
									<div class="info-item">
										<i class="icon pi pi-user"></i>
										<div class="label">Họ và tên</div>
										<div class="value line-clamp-3">{{ user.fullName }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-pen-to-square"></i>
										<div class="label">Mô tả về bản thân</div>
										<div class="value line-clamp-3">{{ user.description }}</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-facebook"></i>
										<div class="label">Facebook</div>
										<div class="value line-clamp-3">
											<a :href="user.facebook" class="underline" target="_blank">{{
												user.facebook
											}}</a>
										</div>
									</div>
									<div class="info-item">
										<i class="icon pi pi-link"></i>
										<div class="label">Zalo</div>
										<div class="value line-clamp-3">{{ user.zalo }}</div>
									</div>
								</template>
							</div>
						</div>
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
						<div class="reviews" @scroll="handleScroll">
							<div v-for="review in reviews" :key="review.id" class="review-item">
								<Card>
									<template #header>
										<div class="review-header">
											<!-- Display MC info if it's McReviewClient, otherwise display Client info -->
											<template v-if="isMcReviewClient(review)">
												<img
													:src="review.mc?.avatarUrl"
													alt="mc avatar"
													class="client-avatar"
												/>
												<div class="client-info">
													<div class="client-name">
														{{ review.mc?.nickName || review.mc?.fullName || "Unknown MC" }}
													</div>
													<div class="review-date" v-format-date="review.createdAt"></div>
												</div>
											</template>
											<template v-else>
												<img
													:src="review.client?.avatarUrl"
													alt="client avatar"
													class="client-avatar"
												/>
												<div class="client-info">
													<div class="client-name">
														{{
															review.client?.fullName ||
															review.client?.nickName ||
															"Unknown Client"
														}}
													</div>
													<div class="review-date" v-format-date="review.createdAt"></div>
												</div>
											</template>
										</div>
									</template>
									<template #content>
										<div class="review-body" :class="{ collapsed: review.collapsed }">
											<Rating v-model="review.overallPoint" readonly></Rating>
											<div class="event-name">{{ review.contract?.eventName }}</div>
											<div class="short-description mb-3">{{ review.shortDescription }}</div>

											<!-- Display paymentPunctualPoint if it's McReviewClient -->
											<template v-if="isMcReviewClient(review)">
												<div
													class="payment-punctual-point-wrapper flex align-center justify-between"
												>
													<div class="label">Thanh toán đúng hạn</div>
													<Rating v-model="review.paymentPunctualPoint" readonly></Rating>
												</div>
											</template>
											<!-- Display proPoint and attitudePoint if it's ClientReviewMc -->
											<template v-else>
												<div class="pro-point-wrapper flex align-center justify-between">
													<div class="label">Kỹ năng chuyên môn</div>
													<Rating v-model="review.proPoint" readonly></Rating>
												</div>

												<div class="attitude-point-wrapper flex align-center justify-between">
													<div class="label">Tinh thần thái độ</div>
													<Rating v-model="review.attitudePoint" readonly></Rating>
												</div>
											</template>

											<div class="reliable-point-wrapper flex align-center justify-between">
												<div class="label">Độ tin cậy</div>
												<Rating v-model="review.reliablePoint" readonly></Rating>
											</div>

											<p>{{ review.detailDescription }}</p>
										</div>
										<div
											v-if="review.collapsed"
											class="view-more-button"
											@click="review.collapsed = false"
										>
											Xem thêm
										</div>
									</template>
								</Card>
							</div>
							<!-- <div v-if="!hasMoreReviews" class="no-more-reviews">
								<p>Không có đánh giá</p>
							</div> -->
						</div>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</section>
		<Dialog
			v-if="isOfferDialogVisible"
			v-model:visible="isOfferDialogVisible"
			modal
			header="Gửi offer"
			id="sendOfferDialog"
		>
			<Form :resolver="offerFormResolver" :initialValues="offer" @submit="onOfferFormSubmit">
				<div class="form-body flex flex-column gap-4">
					<FormField v-slot="$field" name="eventName" class="flex flex-col gap-1">
						<label for="eventName" class="form-label">Tên sự kiện</label>
						<InputText name="eventName" placeholder="Nhập tên sự kiện" v-model="offer.eventName" />
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
								v-model="offer.eventStart"
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
								v-model="offer.eventEnd"
							/>
							<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
								$field.error?.message
							}}</Message>
						</FormField>
					</div>
					<FormField v-slot="$field" name="place" class="flex flex-col gap-1">
						<label for="place" class="form-label">Địa điểm</label>
						<InputText name="place" placeholder="Nhập địa điểm" v-model="offer.place" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<FormField v-slot="$field" name="note" class="flex flex-col gap-1">
						<label for="note" class="form-label">Ghi chú</label>
						<TextArea name="note" placeholder="Nhập ghi chú" v-model="offer.note" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>
					<div class="flex justify-end gap-2">
						<Button
							severity="secondary"
							label="Hủy"
							class="escape-button"
							@click="closeOfferDialog(false)"
						/>
						<Button label="Gửi" class="save-button" type="submit" />
					</div>
				</div>
			</Form>
		</Dialog>
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
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, computed } from "vue";
import { z } from "zod";
import cloneDeep from "lodash/cloneDeep";
import { type User } from "@/entities/user/user";
import { getGenderDataSource, getGenderText } from "@/enums/gender";
import { EditingMode } from "@/enums/editingMode";
import { userApi } from "@/apis/userApi";
import { useRoute, useRouter } from "vue-router";
import { useHostingStyleStore } from "@/stores/hostingStyleStore";
import { useProvinceStore } from "@/stores/provinceStore";
import { useMcTypeStore } from "@/stores/mcTypeStore";
import { useEntity } from "@/composables/useEntity";
import type { HostingStyle } from "@/entities/hostingStyle";
import type { McType } from "@/entities/mcType";
import type { Province } from "@/entities/province";
import { mediaApi } from "@/apis/mediaApi";
import type { Media } from "@/entities/user/media";
import { MediaType } from "@/enums/mediaType";
import { EntityState } from "@/enums/entityState";
import { notificationApi } from "@/apis/notificationApi";
import { type Notification } from "@/entities/notification";
import { type SendOfferAdditionalInfo } from "@/entities/notification/additionalInfo/sendOfferAdditionalInfo";
import { NotificationType } from "@/enums/notificationType";
import { useAuthStore } from "@/stores/authStore";
import { clientReviewMcApi } from "@/apis/clientReviewMcApi";
import type { ClientReviewMc } from "@/entities/clientReviewMc";
import type { ClientReviewMcPagedRequest } from "@/entities/user/paging/clientReviewMcPagedRequest";
import MMediaViewer from "@/components/MMediaViewer.vue";
import draggable from "vuedraggable";
import type { McReviewClient } from "@/entities/mcReviewClient";
import type { McReviewClientPagedRequest } from "@/entities/user/paging/mcReviewClientPagedRequest";
import { mcReviewClientApi } from "@/apis/mcReviewClientApi";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);
const routeTabIndex = Number(route.params.tabIndex);
// user của profile hiện tại
const user = ref<User>({ isMc: true });

// có thể sửa profile hay ko
const hasEditPermission = computed(() => authStore.user!! && authStore.user.id == userId);

// có phải người đang login và người trong profile này là cùng 1 người hay ko
const isLoggedUser = computed(() => authStore.user!! && authStore.user.id == userId);

// Split form resolvers for MC and guest users
const mcFormResolver = zodResolver(
	z.object({
		age: z.number().optional(),
		nickName: z.string().min(1, { message: "Không được bỏ trống" }),
		gender: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		education: z.string().nullable().optional(),
		height: z.any().nullable().optional(),
		weight: z.any().nullable().optional(),
		mcTypes: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		provinces: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		hostingStyles: z.array(z.any()).min(1, { message: "Cần chọn ít nhất 1 giá trị" }),
		facebook: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		zalo: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		isNewbie: z.boolean().nullable(),
	})
);

const guestFormResolver = zodResolver(
	z.object({
		fullName: z.string().min(1, { message: "Không được bỏ trống" }),
		description: z.string().nullable().optional(),
		facebook: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
		zalo: z.string().max(255, { message: "Không được vượt quá 255 ký tự" }).optional().nullable(),
	})
);

const hostingStyleStore = useHostingStyleStore();
const hostingStyles = hostingStyleStore.hostingStyles;

const mcTypesStore = useMcTypeStore();
const mcTypes = mcTypesStore.mcTypes;

const provinceStore = useProvinceStore();
const provinces = provinceStore.provinces;

const genders = ref(getGenderDataSource());

const hostingStylesText = computed(() => {
	return user.value.hostingStyles?.map((style: HostingStyle) => style.label).join(", ") || "";
});

const mcTypesText = computed(() => {
	return user.value.mcTypes?.map((type: McType) => type.label).join(", ") || "";
});

const areasText = computed(() => {
	return user.value.provinces?.map((province: Province) => province.name).join(", ") || "";
});

const editingMode = ref<EditingMode>(EditingMode.None);

const formInitialValues = ref({
	...user.value,
});

const handleSaveGeneralInfo = async (userSave: User) => {
	userSave.id = userId;

	// Handle details' entity state
	if (authStore.user?.isMc == "true") {
		userSave.mcTypes = updateEntityState(userSave.mcTypes, formInitialValues.value.mcTypes);
		userSave.hostingStyles = updateEntityState(userSave.hostingStyles, formInitialValues.value.hostingStyles);
		userSave.provinces = updateEntityState(userSave.provinces, formInitialValues.value.provinces);
	}

	await userApi.update(userId, userSave);

	editingMode.value = EditingMode.None;
	toast.add({
		severity: "success",
		summary: "Đã lưu thông tin",
		detail: "Thông tin chung của bạn đã được lưu",
		life: 3000,
	});

	await setUser();
};

const cancelEditGeneralInfo = () => {
	editingMode.value = EditingMode.None;
};

const { updateEntityState } = useEntity();

//#region Image Tab Panel Logic
const images = ref<Media[]>([]);
const initialImages = ref<Media[]>([]);

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
	input.accept = ".jpg,.jpeg,.png";
	input.onchange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			try {
				alert("Image change event fired!"); // Add this line for testing

				const file = target.files[0];
				const newMedia: Media = {
					id: 0, // Assuming the backend will generate the ID
					userId: userId,
					type: MediaType.Image,
					url: "",
					sortOrder: images.value.length + 1,
					file: file, // Include the file to upload
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
				alert(`error on event change: ${error}`); // Add this line for testing
			}
		}
	};
	input.click();
};
//#endregion

//#region Video Tab Panel Logic
const videos = ref<Media[]>([]);
const initialVideos = ref<Media[]>([]);

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
	input.accept = "video/*";
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

//#region Review Tab Panel Logic
const reviews = ref<ClientReviewMc[] | McReviewClient[]>([]);
const reviewPage = ref(0);
const reviewPageSize = 10;
const hasMoreReviews = ref(true);
const isLoadingReviews = ref(false);

const fetchReviews = async () => {
	if (!hasMoreReviews.value || isLoadingReviews.value) return;

	isLoadingReviews.value = true;

	let response;
	if (user.value.isMc) {
		const pagedRequest: ClientReviewMcPagedRequest = {
			pageIndex: reviewPage.value,
			pageSize: reviewPageSize,
			mcId: userId,
			isUseProc: true,
			isGetContract: true,
			isGetMc: true,
			isGetClient: true,
		};
		response = await clientReviewMcApi.getPaged(pagedRequest);
	} else {
		const pagedRequest: McReviewClientPagedRequest = {
			pageIndex: reviewPage.value,
			pageSize: reviewPageSize,
			clientId: userId,
			isUseProc: true,
			isGetContract: true,
			isGetMc: true,
			isGetClient: true,
		};
		response = await mcReviewClientApi.getPaged(pagedRequest);
	}

	if (response.items.length < reviewPageSize) {
		hasMoreReviews.value = false;
	}

	if (user.value.isMc) {
		reviews.value = reviews.value.concat(
			response.items.map((item: ClientReviewMc) => ({ ...item, collapsed: true }))
		);
	} else {
		reviews.value = reviews.value.concat(
			response.items.map((item: McReviewClient) => ({ ...item, collapsed: true }))
		);
	}

	reviewPage.value++;
	isLoadingReviews.value = false;
};
//#endregion
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
const onFormSubmit = (e) => {
	// e.originalEvent: Represents the native form submit event.
	// e.valid: A boolean that indicates whether the form is valid or not.
	// e.states: Contains the current state of each form field, including validity status.
	// e.errors: An object that holds any validation errors for the invalid fields in the form.
	// e.values: An object containing the current values of all form fields.
	// e.reset: A function that resets the form to its initial state.
	if (e.valid) {
		handleSaveGeneralInfo(e.values);
	}
};

enum TabType {
	GeneralInfo = 0,
	Image = 1,
	Video = 2,
	Review = 3,
}

const activeTab = ref("0");

const handleTabChange = async (value: number) => {
	editingMode.value = EditingMode.None;

	activeTab.value = value.toString();
	if (value == TabType.GeneralInfo) {
		await setUser();
	}
	// Only load images & videos if us.review-header .client-avatar[data-v-423f3bc4]er is MC
	else if (value == TabType.Image && user.value.isMc) {
		await fetchImages();
	} else if (value == TabType.Video && user.value.isMc) {
		await fetchVideos();
	} else if (value == TabType.Review) {
		await fetchReviews();
	}
};

//#region Send offer
const sendOffer = () => {
	openOfferDialog();
};

const isOfferDialogVisible = ref(false);

const defaultOffer = {
	eventName: "",
	eventStart: new Date(),
	eventEnd: new Date(),
	place: "",
	note: "",
};

const offer = ref(cloneDeep(defaultOffer));

const offerFormResolver = zodResolver(
	z
		.object({
			eventName: z.string().min(1, { message: "Vui lòng nhập tên sự kiện" }),
			eventStart: z.date().refine((date) => date >= new Date(), {
				message: "Thời gian bắt đầu phải lớn hơn hoặc bằng thời gian hiện tại",
			}),
			eventEnd: z.date(),
			place: z.string().optional(),
			note: z.string().optional(),
		})
		.refine(
			(formValue) => {
				const eventStart = formValue.eventStart;
				const eventEnd = formValue.eventEnd;
				return eventStart < eventEnd;
			},
			{ message: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu", path: ["eventEnd"] }
		)
);

const authStore = useAuthStore();

const onOfferFormSubmit = async (formInfo: any) => {
	const { valid, values } = formInfo;
	if (valid) {
		const additionalInfo: SendOfferAdditionalInfo = {
			eventName: values.eventName,
			eventStart: values.eventStart,
			eventEnd: values.eventEnd,
			place: values.place,
			note: values.note,
			senderId: authStore.user?.id,
			senderName: authStore.user?.fullName ?? authStore.user?.nickName,
		};

		const notification: Notification = {
			id: 0,
			userId: userId,
			message: "Bạn đã nhận được một offer mới",
			additionalInfo: JSON.stringify(additionalInfo),
			type: NotificationType.SendOffer,
			thumbUrl: authStore.user?.avatarUrl, // Add thumbUrl property
		};

		await notificationApi.create(notification);
		console.log("Offer submitted and notification sent:", values);
		closeOfferDialog(true);
		toast.add({
			severity: "success",
			summary: "Đã gửi offer",
			detail: "Offer của bạn đã được gửi thành công",
			life: 3000,
		});
	}
};

const openOfferDialog = () => {
	isOfferDialogVisible.value = true;
};

const closeOfferDialog = (isSave: boolean = false) => {
	if (isSave) {
		offer.value = cloneDeep(defaultOffer);
	}
	isOfferDialogVisible.value = false;
};
//#endregion

const avatarMenu = ref(null);
const isAvatarDialogVisible = ref(false);

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

const showAvatarMenu = (event: any) => {
	if (hasEditPermission.value) {
		avatarMenu.value?.toggle(event);
	}
};

const handleUpload = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.capture = "camera"; // This attribute allows the use of the camera on mobile devices
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

// #region Image Viewer
const isImageViewerVisible = ref(false);
const selectedImageIndex = ref(0);

const openImageViewer = (index: number) => {
	selectedImageIndex.value = index;
	isImageViewerVisible.value = true;
};
// #endregion

// #region Video Viewer
const isVideoViewerVisible = ref(false);
const selectedVideoIndex = ref(0);

const openVideoViewer = (index: number) => {
	selectedVideoIndex.value = index;
	isVideoViewerVisible.value = true;
};
// #endregion

const isMcReviewClient = (review: any): boolean => {
	return "paymentPunctualPoint" in review;
};

/**
 * Navigate to the identity verification view
 */
const toVerifyIdentityView = () => {
	router.push({
		name: "user-identity-verification",
	});
};
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

.tab-content-wrapper {
	margin-top: 12px;

	.top {
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		margin-bottom: 12px;
		align-items: center;
	}
}

.general-info-wrapper {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.info-item {
		display: flex;
		align-items: baseline;

		.label {
			width: 10rem;
			flex-shrink: 0;
			margin-left: 10px;
		}
		.value {
			font-size: 1.1rem;
			font-weight: 600;
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

.review-item {
	margin-bottom: 16px;
}

.review-header {
	display: flex;
	align-items: center;
	padding: var(--p-card-body-padding);
	padding-bottom: 0;

	.client-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 12px;
		object-fit: cover;
	}

	.client-info {
		.client-name {
			font-weight: 500;
		}

		.review-date {
			font-size: 0.875rem;
			color: #888;
		}
	}
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
