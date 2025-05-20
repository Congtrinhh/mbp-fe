export enum Gender {
	Male = 1,
	Female = 2,
	Other = 3,
}

export function getGenderText(gender: Gender): string {
	switch (gender) {
		case Gender.Male:
			return "Nam";
		case Gender.Female:
			return "Nữ";
		case Gender.Other:
			return "Khác";
		default:
			return "";
	}
}

export function getGenderDataSource() {
	return [
		{ name: getGenderText(Gender.Male), code: Gender.Male },
		{ name: getGenderText(Gender.Female), code: Gender.Female },
		{ name: getGenderText(Gender.Other), code: Gender.Other },
	];
}
