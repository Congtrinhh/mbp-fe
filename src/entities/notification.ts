import type { BaseEntity } from "./baseEntity";
import { NotificationType } from "@/enums/notificationType";
import { NotificationStatus } from "@/enums/notificationStatus";

export interface Notification extends BaseEntity {
	userId: number;
	message: string;
	isRead?: boolean;
	type?: NotificationType;
	additionalInfo?: string;
	thumbUrl?: string;
	status?: NotificationStatus;
}
