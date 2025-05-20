<template>
	<header class="header" id="header">
		<div id="sidebarToggle" class="sidebar-toggle" @click="isSidebarVisible = true">
			<i class="pi pi-align-justify" style="font-size: 1.5rem"></i>
		</div>
		<div class="logo-wrapper">{{ appName }}</div>
		<div class="functional-buttons">
			<div class="mc-group-button" @click="toggleMCGroupMenu" aria-haspopup="true" aria-controls="mcGroupMenu">
				<i class="pi pi-users" style="font-size: 1.5rem"></i>
			</div>

			<div class="search-button" @click="isDialogSearchVisible = true">
				<i class="pi pi-search" style="font-size: 1.5rem"></i>
			</div>
			<div class="user-button" @click="toggleUserMenu" aria-haspopup="true" aria-controls="userMenu">
				<i class="pi pi-user" style="font-size: 1.5rem"></i>
			</div>

			<Menu ref="userMenu" id="userMenu" :model="userMenuItems" :popup="true" />

			<Menu ref="mcGroupMenu" id="mcGroupMenu" :model="mcGroupMenuItems" :popup="true" />

			<Dialog v-model:visible="isDialogSearchVisible" modal header="Tìm MC" :style="{ width: '25rem' }">
				<Form
					v-slot="$form"
					:initialValues
					:resolver
					:validateOnValueUpdate="false"
					:validateOnBlur="true"
					:validateOnMount="['firstName']"
					@submit="handleSearch"
					class="flex flex-col gap-4 w-full sm:w-56"
				>
					<FormField v-slot="$field" name="username" class="flex flex-col gap-1">
						<InputText type="text" placeholder="Username" />
						<Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
							$field.error?.message
						}}</Message>
					</FormField>

					<Button type="submit" severity="secondary" label="Tìm" />
				</Form>
			</Dialog>
		</div>
	</header>
	<Drawer v-model:visible="isSidebarVisible" header="Drawer" id="sidebar">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
			dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
			ea commodo consequat.
		</p>
	</Drawer>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { ref } from "vue";

const appStore = useAppStore();
const appName = appStore.appName;
//#endregion Sidebar
const isSidebarVisible = ref(false);
//#endregion

//#region User Menu
const userMenuItems = ref([
	{ label: "Quản lý tài khoản", icon: "pi pi-user" },
	{ label: "Hợp đồng", icon: "pi pi-history" },
	{ label: "Đăng xuất", icon: "pi pi-sign-out" },
]);

const userMenu = ref();
const toggleUserMenu = (event: Event) => {
	userMenu.value.toggle(event);
};
//#endregion

//#region MC Group Menu
const mcGroupMenu = ref();
const toggleMCGroupMenu = (event: Event) => {
	mcGroupMenu.value.toggle(event);
};
const mcGroupMenuItems = ref([{ label: "Nhóm MC mới" }, { label: "Nhóm MC chung" }]);
//#endregion

//#region Search Dialog
const isDialogSearchVisible = ref(false);

const initialValues = ref({
	username: "",
	firstName: "",
	lastName: "",
});
const resolver = ({ values }) => {
	const errors = {};

	if (!values.username) {
		errors.username = [{ message: "Username is required." }];
	}

	if (!values.name) {
		errors.firstName = [{ message: "First name is required." }];
	}

	if (!values.surname) {
		errors.lastName = [{ message: "Last name is required." }];
	}

	return {
		errors,
	};
};

const handleSearch = ({ valid }) => {
	if (valid) {
		// toast.add({ severity: "success", summary: "Form is submitted.", life: 3000 });
		isDialogSearchVisible.value = false;
	}
};
//#endregion
</script>
<style scoped lang="scss">
#header {
	height: 60px;
	padding: 10px 16px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #ccc;
}
#sidebar {
	position: fixed;
	top: 0;
	bottom: 0;
	left: -240px;
	width: 240px;
	background-color: #fff;
	transition: left 0.3s;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.functional-buttons {
	display: flex;
	align-items: center;
	margin-left: auto;
	gap: 16px;
}
.logo-wrapper {
	margin-left: 36px;
}
#sidebarToggle {
	display: inline-block;
}
</style>
