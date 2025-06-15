/**
 * AdminBaseApi Module
 *
 * Base class for all admin API endpoints that provides standard CRUD operations with admin authentication.
 * Implements a separate axios instance with admin-specific configuration and interceptors.
 *
 * Features:
 * - Admin token authentication
 * - CORS headers configuration
 * - Generic CRUD operations for admin endpoints
 * - Type-safe responses with generics
 *
 * created by tqcong 20/5/2025.
 */

import axios from "axios";
import type { ListParams, ListResponse } from "@/components/admin/types";
import type { BaseEntity } from "@/entities/baseEntity";

// Create a separate axios instance for admin APIs
const adminAxios = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add request interceptor for auth
adminAxios.interceptors.request.use((config) => {
	const token = localStorage.getItem("admin_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	// Add headers for CORS
	config.headers["Content-Type"] = "application/json";
	config.headers["Access-Control-Allow-Origin"] = import.meta.env.VITE_API_BASE_URL;
	config.headers["Access-Control-Allow-Credentials"] = true;

	return config;
});

/**
 * Base API class for admin endpoints
 * Provides standardized CRUD operations with admin authentication
 *
 * @template T - Type that extends BaseEntity
 * created by tqcong 20/5/2025.
 */
export class AdminBaseApi<T extends BaseEntity> {
	/**
	 * Creates an instance of AdminBaseApi
	 * @param {string} endpoint - The API endpoint path
	 * created by tqcong 20/5/2025.
	 */
	constructor(private endpoint: string) {}

	/**
	 * Retrieves a paged list of items
	 * @param {ListParams} params - Pagination and filtering parameters
	 * @returns {Promise<ListResponse<T>>} - Paged response containing items
	 * created by tqcong 20/5/2025.
	 */
	async getPaged(params: ListParams): Promise<ListResponse<T>> {
		const response = await adminAxios.post<ListResponse<T>>(`/admin/${this.endpoint}/paged`, params);
		return response.data;
	}

	/**
	 * Creates a new item
	 * @param {Partial<T>} data - The data to create the item with
	 * @returns {Promise<T>} - The created item
	 * created by tqcong 20/5/2025.
	 */
	async add(data: Partial<T>): Promise<T> {
		const response = await adminAxios.post<T>(`/admin/${this.endpoint}`, data);
		return response.data;
	}

	/**
	 * Deletes an item by ID
	 * @param {number} id - ID of the item to delete
	 * @returns {Promise<void>}
	 * created by tqcong 20/5/2025.
	 */
	async delete(id: number): Promise<void> {
		await adminAxios.delete(`/admin/${this.endpoint}/${id}`);
	}

	/**
	 * Retrieves a single item by ID
	 * @param {number} id - ID of the item to retrieve
	 * @returns {Promise<T>} - The retrieved item
	 * created by tqcong 20/5/2025.
	 */
	async getById(id: number): Promise<T> {
		const response = await adminAxios.get<T>(`/admin/${this.endpoint}/${id}`);
		return response.data;
	}

	/**
	 * Updates an existing item
	 * @param {number} id - ID of the item to update
	 * @param {Partial<T>} data - The update data
	 * @returns {Promise<T>} - The updated item
	 * created by tqcong 20/5/2025.
	 */
	async update(id: number, data: Partial<T>): Promise<T> {
		const response = await adminAxios.put<T>(`/admin/${this.endpoint}/${id}`, data);
		return response.data;
	}
}
