import type { User } from "@/entities/user/user";
import { AdminBaseApi } from "./adminBaseApi";

class McManagementApi extends AdminBaseApi<User> {
	constructor() {
		super("AdminUsers"); // endpoint for managing MC users in admin side
	}
}

export const mcManagementApi = new McManagementApi();
