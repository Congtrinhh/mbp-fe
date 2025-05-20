import type { PagedRequest } from "@/entities/user/paging/pagedRequest";
import type { PagedResponse } from "@/entities/user/paging/pagedResponse";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { showLoading, hideLoading } from "@/composables/useLoading"; // Import loading utilities

class BaseApi<T> {
	public static axiosInstance: AxiosInstance;
	protected baseUrl: string;
	private defaultBaseUrl = import.meta.env.VITE_API_BASE_URL;
	// private defaultBaseUrl = "http://production.eba-nbh3jtv6.ap-southeast-1.elasticbeanstalk.com/api";
	protected baseEndpoint = "";

	private static instances: { [key: string]: BaseApi<any> } = {};

	constructor(baseEndpoint: string, baseUrl?: string) {
		this.baseEndpoint = baseEndpoint;

		if (baseUrl) {
			this.baseUrl = baseUrl;
		} else {
			this.baseUrl = this.defaultBaseUrl;
		}

		if (!BaseApi.axiosInstance) {
			BaseApi.axiosInstance = axios.create({
				baseURL: this.baseUrl,
			});
		}
	}

	/**
	 * Used to make singleton instances of the BaseApi class.
	 * Returns an instance of `BaseApi` for the specified `baseEndpoint`.
	 * If an instance does not already exist, it creates a new one.
	 *
	 * @template T - The type of the data that the API will handle.
	 * @param {string} baseEndpoint - The endpoint for which the `BaseApi` instance is created.
	 * @param {string} [baseUrl] - An optional base URL for the API.
	 * @returns {BaseApi<T>} The `BaseApi` instance for the specified `baseEndpoint`.
	 */
	public static getInstance<T>(baseEndpoint: string, baseUrl?: string): BaseApi<T> {
		if (!BaseApi.instances[baseEndpoint]) {
			BaseApi.instances[baseEndpoint] = new BaseApi<T>(baseEndpoint, baseUrl);
		}
		return BaseApi.instances[baseEndpoint];
	}

	public async getAll(isShowLoading: boolean = true): Promise<T[]> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T[]> = await BaseApi.axiosInstance.get<T[]>(`/${this.baseEndpoint}`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async getPaged(pagedRequest: PagedRequest, isShowLoading: boolean = true): Promise<PagedResponse<T>> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<PagedResponse<T>> = await BaseApi.axiosInstance.post<PagedResponse<T>>(
				`/${this.baseEndpoint}/paged`,
				pagedRequest
			);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async getById(id: number, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.get<T>(`/${this.baseEndpoint}/${id}`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async create(data: T, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.post<T>(`/${this.baseEndpoint}`, data);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async update(id: number, data: T, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.put<T>(`/${this.baseEndpoint}/${id}`, data);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	public async delete(id: number, isShowLoading: boolean = true): Promise<void> {
		if (isShowLoading) showLoading();
		try {
			await BaseApi.axiosInstance.delete<void>(`/${this.baseEndpoint}/${id}`);
		} finally {
			if (isShowLoading) hideLoading();
		}
	}
}

export default BaseApi;
