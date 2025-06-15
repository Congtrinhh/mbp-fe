/**
 * BaseApi Module
 *
 * A generic base API class providing common CRUD operations and pagination support.
 * Implements singleton pattern for API instances to prevent duplicate instances.
 *
 * Features:
 * - Generic CRUD operations with TypeScript support
 * - Pagination with request/response handling
 * - Loading state management
 * - Singleton pattern for API instances
 * - Axios instance configuration
 *
 * created by tqcong 20/5/2025.
 */

import type { PagedRequest } from "@/entities/user/paging/pagedRequest";
import type { PagedResponse } from "@/entities/user/paging/pagedResponse";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { showLoading, hideLoading } from "@/composables/useLoading";
// import { dateUtils } from '@/utils/dateUtils'; // Uncomment if date processing is required

/**
 * Generic base API class for handling CRUD operations
 * @template T - Type of entity this API handles
 * created by tqcong 20/5/2025.
 */
class BaseApi<T> {
	/**
	 * Shared axios instance for all API calls
	 * Configured with base URL from environment
	 * created by tqcong 20/5/2025.
	 */
	public static axiosInstance: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
	});

	/**
	 * Base URL for API endpoints
	 * created by tqcong 20/5/2025.
	 */
	protected baseUrl: string;

	/**
	 * Endpoint path for this API instance
	 * created by tqcong 20/5/2025.
	 */
	protected baseEndpoint = "";

	/**
	 * Cache of API instances to implement singleton pattern
	 * created by tqcong 20/5/2025.
	 */
	private static instances: { [key: string]: BaseApi<any> } = {};

	/**
	 * Creates a new instance of BaseApi
	 * @param {string} baseEndpoint - The endpoint path for this API instance
	 * @param {string} [baseUrl] - Optional base URL override
	 * created by tqcong 20/5/2025.
	 */
	constructor(baseEndpoint: string, baseUrl?: string) {
		this.baseEndpoint = baseEndpoint;
		this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL;
	}

	/**
	 * Returns a singleton instance of BaseApi for the given endpoint
	 * @param {string} baseEndpoint - The endpoint path for this API instance
	 * @param {string} [baseUrl] - Optional base URL override
	 * @returns {BaseApi<T>} Singleton instance for the endpoint
	 * created by tqcong 20/5/2025.
	 */
	public static getInstance<T>(baseEndpoint: string, baseUrl?: string): BaseApi<T> {
		if (!BaseApi.instances[baseEndpoint]) {
			BaseApi.instances[baseEndpoint] = new BaseApi<T>(baseEndpoint, baseUrl);
		}
		return BaseApi.instances[baseEndpoint];
	}

	/**
	 * Retrieves all items from the endpoint
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<T[]>} Array of items
	 * created by tqcong 20/5/2025.
	 */
	public async getAll(isShowLoading: boolean = true): Promise<T[]> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T[]> = await BaseApi.axiosInstance.get<T[]>(`/${this.baseEndpoint}`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	/**
	 * Retrieves a paged list of items
	 * @param {PagedRequest} pagedRequest - Pagination parameters and filters
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<PagedResponse<T>>} Paged response containing items and metadata
	 * created by tqcong 20/5/2025.
	 */
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

	/**
	 * Retrieves a single item by ID
	 * @param {number} id - ID of the item to retrieve
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<T>} The requested item
	 * created by tqcong 20/5/2025.
	 */
	public async getById(id: number, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.get<T>(`/${this.baseEndpoint}/${id}`);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	/**
	 * Creates a new item
	 * @param {T} data - The data for the new item
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<T>} The created item
	 * created by tqcong 20/5/2025.
	 */
	public async create(data: T, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.post<T>(`/${this.baseEndpoint}`, data);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	/**
	 * Updates an existing item
	 * @param {number} id - ID of the item to update
	 * @param {T} data - The new data for the item
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<T>} The updated item
	 * created by tqcong 20/5/2025.
	 */
	public async update(id: number, data: T, isShowLoading: boolean = true): Promise<T> {
		if (isShowLoading) showLoading();
		try {
			const response: AxiosResponse<T> = await BaseApi.axiosInstance.put<T>(`/${this.baseEndpoint}/${id}`, data);
			return response.data;
		} finally {
			if (isShowLoading) hideLoading();
		}
	}

	/**
	 * Deletes an item by ID
	 * @param {number} id - ID of the item to delete
	 * @param {boolean} [isShowLoading=true] - Whether to show loading indicator
	 * @returns {Promise<void>}
	 * created by tqcong 20/5/2025.
	 */
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
