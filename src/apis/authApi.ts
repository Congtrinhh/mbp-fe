/**
 * Authentication API Service
 *
 * Handles authentication operations including:
 * - Google OAuth authentication
 * - User registration with role selection
 * - Session management
 *
 * Uses singleton pattern to ensure single instance across app.
 * Extends BaseApi for common API functionality.
 *
 * created by tqcong 20/5/2025.
 */

import BaseApi from "./baseApi";

class AuthApi extends BaseApi<any> {
	/** Singleton instance */
	private static instance: AuthApi;

	/**
	 * Initialize auth API with base endpoint
	 * created by tqcong 20/5/2025.
	 */
	constructor() {
		super("auth");
	}

	/**
	 * Gets singleton instance of AuthApi
	 * @returns {AuthApi} Singleton instance
	 * created by tqcong 20/5/2025.
	 */
	public static getInstance(): AuthApi {
		if (AuthApi.instance == null) {
			AuthApi.instance = new AuthApi();
		}
		return AuthApi.instance;
	}

	/**
	 * Authenticate user with Google credentials
	 * @param {string} accessToken - Google OAuth access token
	 * @param {boolean} isCreateUser - Whether to create new user account
	 * @param {boolean} isMc - Whether user is registering as MC
	 * @param {boolean | null} isNewbie - Whether MC is new or experienced
	 * @returns {Promise<any>} Authentication response with tokens and user info
	 * created by tqcong 20/5/2025.
	 */
	public loginWithGoogle = async (
		accessToken: string,
		isCreateUser: boolean,
		isMc: boolean,
		isNewbie: boolean | null
	): Promise<any> => {
		return await BaseApi.axiosInstance.post(`/${this.baseEndpoint}/google-login`, {
			accessToken,
			isCreateUser,
			isMc,
			isNewbie,
		});
	};

	/**
	 * Ends user session
	 * Clears server-side session and invalidates tokens
	 * @returns {Promise<any>} Logout response
	 * created by tqcong 20/5/2025.
	 */
	public logout = async (): Promise<any> => {
		return await BaseApi.axiosInstance.post(`/${this.baseEndpoint}/logout`);
	};
}

/**
 * Singleton instance of AuthApi
 * Use this for all authentication operations
 * created by tqcong 20/5/2025.
 */
export const authApi = AuthApi.getInstance();
