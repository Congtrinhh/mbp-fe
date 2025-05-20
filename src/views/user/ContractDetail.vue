<template>
	<main class="main-container">
		<template v-if="contract">
			<div class="info-container">
				<div class="info-item items-center">
					<label>Khách hàng:</label>
					<div class="value">
						<Avatar :image="contract.client?.avatarUrl" shape="circle" />
						<span class="font-medium p-2">{{
							contract.client?.nickName || contract.client?.fullName
						}}</span>
					</div>
				</div>
				<div class="info-item items-center">
					<label>MC:</label>
					<div class="value">
						<Avatar :image="contract.mc?.avatarUrl" shape="circle" />
						<span class="font-medium p-2">{{ contract.mc?.nickName || contract.mc?.fullName }}</span>
					</div>
				</div>
				<div class="info-item">
					<label>Sự kiện:</label>
					<div class="value font-medium">{{ contract.eventName }}</div>
				</div>
				<div class="info-item">
					<label>Bắt đầu:</label>
					<div class="value" v-format-date="contract.eventStart"></div>
				</div>
				<div class="info-item">
					<label>Kết thúc:</label>
					<div class="value" v-format-date="contract.eventEnd"></div>
				</div>
				<div class="info-item">
					<label>Địa điểm:</label>
					<div class="value">{{ contract.place }}</div>
				</div>
				<div class="info-item">
					<label>Mô tả:</label>
					<div class="value">{{ contract.description }}</div>
				</div>
			</div>
			<hr />
			<div class="additional-info">
				<div class="info-item">
					<label>Ngày tạo:</label>
					<div class="value" v-format-date="contract.createdAt"></div>
				</div>
				<div class="info-item">
					<label>Trạng thái:</label>
					<div class="value">
						<Tag
							v-if="contract.status === ContractStatus.InEffect"
							severity="success"
							:value="getContractStatusText(contract.status)"
						/>
						<Tag
							v-if="contract.status === ContractStatus.Canceled"
							severity="danger"
							:value="getContractStatusText(contract.status)"
						/>
						<Tag
							v-if="contract.status === ContractStatus.Completed"
							severity="info"
							:value="getContractStatusText(contract.status)"
						/>
					</div>
				</div>
				<template v-if="contract.status === ContractStatus.Canceled">
					<div class="info-item items-center" v-if="contract.clientCancelDate">
						<label>Hủy bởi:</label>
						<div class="value">
							<Avatar :image="contract.client?.avatarUrl" shape="circle" />
							<span class="font-medium p-2">{{
								contract.client?.nickName || contract.client?.fullName
							}}</span>
						</div>
					</div>
					<div class="info-item items-center" v-if="contract.mcCancelDate">
						<label>Hủy bởi:</label>
						<div class="value">
							<Avatar :image="contract.mc?.avatarUrl" shape="circle" />
							<span class="font-medium p-2">{{ contract.mc?.nickName || contract.mc?.fullName }}</span>
						</div>
					</div>
					<div v-if="contract.mcCancelDate" class="info-item">
						<label>Hủy ngày:</label>
						<div class="value">{{ contract.mcCancelDate }}</div>
					</div>
					<div v-if="contract.mcCancelReason" class="info-item">
						<label>Lý do:</label>
						<div class="value">{{ contract.mcCancelReason }}</div>
					</div>
					<div v-if="contract.clientCancelDate" class="info-item">
						<label>Hủy ngày:</label>
						<div class="value">{{ contract.clientCancelDate }}</div>
					</div>
					<div v-if="contract.clientCancelReason" class="info-item">
						<label>Lý do:</label>
						<div class="value">{{ contract.clientCancelReason }}</div>
					</div>
				</template>
				<!-- buttons -->
				<div v-if="contract?.status === ContractStatus.InEffect" class="buttons">
					<Button label="Hủy hợp đồng" severity="danger" @click="onCancelContract" />
				</div>
			</div>
		</template>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { contractApi } from "@/apis/contractApi";
import type { Contract } from "@/entities/contract";
import { ContractStatus, getContractStatusText } from "@/enums/contractStatus";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const route = useRoute();
const contract = ref<Contract | null>(null);
const authStore = useAuthStore();

const isMc = computed(() => authStore.user?.isMc == "true");

const fetchContract = async (id: number) => {
	try {
		contract.value = await contractApi.getById(id);
	} catch (error) {
		console.error("Error fetching contract detail", error);
	}
};

function getCanceledContract(original: Contract, isMc: boolean): Contract {
	const canceled = { ...original, status: ContractStatus.Canceled };
	if (isMc) {
		canceled.mcCancelDate = new Date().toISOString();
		canceled.mcCancelReason = "Hết nhu cầu";
	} else {
		canceled.clientCancelDate = new Date().toISOString();
		canceled.clientCancelReason = "Hết nhu cầu";
	}
	return canceled;
}

const onCancelContract = async () => {
	if (!contract.value) return;
	try {
		const updatedContract = getCanceledContract(contract.value, isMc.value);
		await contractApi.update(contract.value.id, updatedContract);
		toast.add({
			severity: "success",
			summary: "Đã hủy hợp đồng",
			detail: "Hợp đồng đã được hủy thành công",
			life: 3000,
		});
		await fetchContract(contract.value.id);
	} catch (error) {
		console.error("Error canceling contract", error);
	}
};

onMounted(() => {
	const id = Number(route.params.id);
	fetchContract(id);
});
</script>

<style lang="scss" scoped>
.main-container {
	background-color: #fff;
	display: flex;
	flex-direction: column;
	padding: 16px;
}

.info-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 20px;
}

.info-item {
	display: flex;
	label {
		flex: 0 0 auto;
		width: 120px;
		margin-right: 4px;
	}
	.value {
		display: flex;
		align-items: center;
	}
}

.additional-info {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 20px;
}

.buttons {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
