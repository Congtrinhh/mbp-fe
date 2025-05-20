import BaseApi from "./baseApi";

class AuthApi extends BaseApi<any> {
	private static instance: AuthApi;

	constructor() {
		super("auth");
	}

	public static getInstance(): AuthApi {
		if (AuthApi.instance == null) {
			AuthApi.instance = new AuthApi();
		}
		return AuthApi.instance;
	}

	//write login with google function accepting access token and a boolean parameter called isSignUp
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

	// Add logout method
	public logout = async (): Promise<any> => {
		return await BaseApi.axiosInstance.post(`/${this.baseEndpoint}/logout`);
	};
}

export const authApi = AuthApi.getInstance();
