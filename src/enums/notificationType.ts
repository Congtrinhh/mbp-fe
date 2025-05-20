export enum NotificationType {
	//gửi/nhận offer dẫn chương trình
	SendOffer = 1,
	// offer bị từ chối
	OfferRejected = 2,
	// offer được chấp nhận
	OfferApproved = 3,
	// nhắc nhở đánh giá
	ReviewReminder = 4,
	// hợp đồng bị hủy
	ContractCanceled = 5,
}
