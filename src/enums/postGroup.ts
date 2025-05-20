export enum PostGroup {
	Common = 0,
	Newbie = 1,
}

export function getPostGroupText(postGroup: PostGroup): string {
	switch (postGroup) {
		case PostGroup.Common:
			return "Chung";
		case PostGroup.Newbie:
			return "MC mới";
		default:
			return "";
	}
}

export function getPostGroupDataSource() {
	return [
		{ text: getPostGroupText(PostGroup.Common), value: PostGroup.Common },
		{ text: getPostGroupText(PostGroup.Newbie), value: PostGroup.Newbie },
	];
}
