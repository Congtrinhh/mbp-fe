import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import GoogleSignInPlugin from "vue3-google-signin";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import { definePreset } from "@primevue/themes";
import { useAppStore } from "./stores/appStore";
import { vietnamese } from "./config/localeConfig";

// Import and configure Day.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";

// Configure Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.locale("vi");
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

import ConfirmationService from "primevue/confirmationservice";
import { useAuthStore } from "./stores/authStore";
import formatDate from "./directives/formatDate";

const app = createApp(App);
const pinia = createPinia();

const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: "{yellow.50}",
			100: "{yellow.100}",
			200: "{yellow.200}",
			300: "{yellow.300}",
			400: "{yellow.400}",
			500: "{yellow.500}",
			600: "{yellow.600}",
			700: "{yellow.700}",
			800: "{yellow.800}",
			900: "{yellow.900}",
			950: "{yellow.950}",
		},
	},
});

app.use(pinia);

app.use(router);
app.use(PrimeVue, {
	theme: {
		preset: MyPreset,
	},
	locale: vietnamese,
});
app.use(ToastService);
app.use(GoogleSignInPlugin, {
	clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});
app.use(ConfirmationService); //confirm dialog

// Register the directive globally
app.directive("format-date", formatDate);

const authStore = useAuthStore();
authStore.initialize(); //initialize user if exists
//	Initialize data
const appStore = useAppStore();
appStore.initializeApp().then(() => {
	app.mount("#app");
});

// Stop SignalR connections when the user leaves the application or navigates to another website
window.addEventListener("beforeunload", () => {
	const authStore = useAuthStore();
	authStore.stopSignalRConnection();
});
