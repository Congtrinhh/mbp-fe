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

export const dateUtils = {
	/**
	 * Convert local date to UTC
	 */
	toUTC(date: Date | string | null | undefined): string | null {
		if (!date) return null;
		return dayjs(date).utc().format();
	},

	/**
	 * Convert UTC date to local timezone
	 */
	toLocal(date: string | Date | null | undefined): Date | null {
		if (!date) return null;
		return dayjs.utc(date).local().toDate();
	},

	/**
	 * Format date for display using Vietnamese locale
	 */
	formatDate(date: Date | string | null | undefined, format: string = "DD/MM/YYYY HH:mm"): string {
		if (!date) return "";
		return dayjs(date).format(format);
	},

	/**
	 * Check if value is ISO date string
	 */
	isISODateString(value: unknown): boolean {
		return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
	},

	/**
	 * Process object for API request (convert dates to UTC)
	 */
	processForApi<T>(obj: T): T {
		if (!obj) return obj;

		if (obj instanceof Date) {
			return this.toUTC(obj) as unknown as T;
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => this.processForApi(item)) as unknown as T;
		}

		if (typeof obj === "object") {
			const result: Record<string, unknown> = {};
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					result[key] = this.processForApi((obj as Record<string, unknown>)[key]);
				}
			}
			return result as T;
		}

		if (this.isISODateString(obj)) {
			return this.toUTC(obj as string) as unknown as T;
		}

		return obj;
	},

	/**
	 * Process API response (convert UTC dates to local)
	 */
	processFromApi<T>(obj: T): T {
		if (!obj) return obj;

		if (Array.isArray(obj)) {
			return obj.map((item) => this.processFromApi(item)) as unknown as T;
		}

		if (typeof obj === "object") {
			const result: Record<string, unknown> = {};
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					result[key] = this.processFromApi((obj as Record<string, unknown>)[key]);
				}
			}
			return result as T;
		}

		if (this.isISODateString(obj)) {
			return this.toLocal(obj as string) as unknown as T;
		}

		return obj;
	},
};

export default dateUtils;
