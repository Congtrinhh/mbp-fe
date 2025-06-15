/**
 * Authentication Store Module
 *
 * This store manages the authentication state, token handling, and real-time notification
 * connections using SignalR. It provides functionalities for user login/logout and
 * maintains the authenticated user's session.
 *
 * Key Features:
 * - JWT token management with local storage persistence
 * - Automatic request interceptor for token injection
 * - SignalR connection handling for real-time notifications
 * - User session management
 *
 * created by tqcong 20/5/2025.
 */

import { type User } from "@/entities/user/user";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import BaseApi from "@/apis/baseApi";
import * as signalR from "@microsoft/signalr";
import { useAppStore } from "./appStore";

/** Key used for storing the authentication token in localStorage */
const tokenKey = "mbp_token";

export const useAuthStore = defineStore("auth", {
	/**
	 * Store state containing authentication and user data
	 * @property {string | null} token - JWT authentication token
	 * @property {User | null} user - Currently authenticated user information
	 * @property {signalR.HubConnection | null} notificationConnection - SignalR connection for real-time notifications
	 */
	state: () => ({
		token: null as string | null,
		user: null as User | null,
		notificationConnection: null as signalR.HubConnection | null,
	}),
	actions: {
		/**
		 * Handles user login by storing the JWT token and setting up necessary configurations
		 *
		 * This function:
		 * 1. Stores the provided token in state and localStorage
		 * 2. Decodes user information from the token
		 * 3. Sets up axios interceptors for authentication
		 * 4. Establishes SignalR connection for notifications
		 *
		 * @param {string} token - JWT token received from authentication
		 * created by tqcong 20/5/2025.
		 */
		login(token: string) {
			this.token = token;
			this.user = jwtDecode<User>(token);
			localStorage.setItem(tokenKey, token);

			BaseApi.axiosInstance.interceptors.request.use(
				(config) => {
					if (this.token) {
						config.headers.Authorization = `Bearer ${this.token}`;
					}
					return config;
				},
				(error) => {
					return Promise.reject(error);
				}
			);

			this.startSignalRConnection();
		},
		/**
		 * Handles user logout by clearing authentication data
		 *
		 * This function:
		 * 1. Clears token and user data from state
		 * 2. Removes token from localStorage
		 * 3. Disconnects from SignalR notification hub
		 *
		 * created by tqcong 20/5/2025.
		 */
		logout() {
			this.token = null;
			this.user = null;
			localStorage.removeItem(tokenKey);
			this.stopSignalRConnection();
		},
		/**
		 * Initializes the authentication state from localStorage
		 *
		 * This function:
		 * 1. Checks for existing token in localStorage
		 * 2. If found, restores the authentication state
		 * 3. Sets up axios interceptors
		 * 4. Reconnects to SignalR notification hub
		 *
		 * created by tqcong 20/5/2025.
		 */
		initialize() {
			const token = localStorage.getItem(tokenKey);
			if (token) {
				this.token = token;
				this.user = jwtDecode<User>(token);

				BaseApi.axiosInstance.interceptors.request.use(
					(config) => {
						if (this.token) {
							config.headers.Authorization = `Bearer ${this.token}`;
						}
						return config;
					},
					(error) => {
						return Promise.reject(error);
					}
				);

				this.startSignalRConnection();
			}
		},
		/**
		 * Establishes a SignalR connection to the notification hub
		 *
		 * This function:
		 * 1. Creates a new SignalR connection if none exists
		 * 2. Configures the connection with authentication
		 * 3. Sets up notification handling
		 * 4. Attempts to start the connection
		 *
		 * @returns {Promise<void>} Resolves when connection is established
		 * created by tqcong 20/5/2025.
		 */
		async startSignalRConnection() {
			if (this.notificationConnection) {
				return;
			}
			this.notificationConnection = new signalR.HubConnectionBuilder()
				.withUrl(`${import.meta.env.VITE_API_ROOT_HOST_URL}/notificationHub?userId=${this.user?.id}`, {
					skipNegotiation: true,
					transport: signalR.HttpTransportType.WebSockets,
					accessTokenFactory: () => this.token || "",
				})
				.build();

			this.notificationConnection.on("ReceiveNotification", (message: string) => {
				console.log("noti from authstore", message);
				useAppStore().unreadNotificationCount++;
			});

			try {
				await this.notificationConnection.start();
				console.log("SignalR connection established.");
			} catch (err) {
				console.error("Error establishing SignalR connection:", err);
			}
		},
		/**
		 * Terminates the SignalR connection to the notification hub
		 *
		 * This function:
		 * 1. Checks for existing connection
		 * 2. Gracefully stops the connection if active
		 * 3. Cleans up connection resources
		 *
		 * @returns {Promise<void>} Resolves when connection is terminated
		 * created by tqcong 20/5/2025.
		 */
		async stopSignalRConnection() {
			if (!this.notificationConnection) {
				return;
			}
			try {
				await this.notificationConnection.stop();
				this.notificationConnection = null;
				console.log("SignalR connection stopped.");
			} catch (err) {
				console.error("Error stopping SignalR connection:", err);
			}
		},
	},
});
