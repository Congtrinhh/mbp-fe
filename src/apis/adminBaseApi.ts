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

export class AdminBaseApi<T extends BaseEntity> {
	constructor(private endpoint: string) {}

	async getPaged(params: ListParams): Promise<ListResponse<T>> {
		const response = await adminAxios.post<ListResponse<T>>(`/admin/${this.endpoint}/paged`, params);
		return response.data;
	}

	async add(data: Partial<T>): Promise<T> {
		const response = await adminAxios.post<T>(`/admin/${this.endpoint}`, data);
		return response.data;
	}

	async delete(id: number): Promise<void> {
		await adminAxios.delete(`/admin/${this.endpoint}/${id}`);
	}

	async getById(id: number): Promise<T> {
		const response = await adminAxios.get<T>(`/admin/${this.endpoint}/${id}`);
		return response.data;
	}

	async update(id: number, data: Partial<T>): Promise<T> {
		const response = await adminAxios.put<T>(`/admin/${this.endpoint}/${id}`, data);
		return response.data;
	}
}
