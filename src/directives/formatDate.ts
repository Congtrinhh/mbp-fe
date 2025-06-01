import { type DirectiveBinding } from "vue";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const formatDate = (el: HTMLElement, binding: DirectiveBinding) => {
	const dateValue = binding.value;
	const isRelativeNow = binding.arg === "isRelativeNow";

	if (!dateValue) {
		// Nếu không có giá trị ngày tháng, xóa nội dung của phần tử
		el.textContent = "-";
		return;
	}
	if (isRelativeNow) {
		el.textContent = formatDistanceToNow(new Date(dateValue), { addSuffix: true, locale: vi });
	} else {
		el.textContent = format(new Date(dateValue), "dd/MM/yyyy HH:mm", { locale: vi });
	}
};

export default {
	beforeMount(el: HTMLElement, binding: DirectiveBinding) {
		formatDate(el, binding);
	},
	updated(el: HTMLElement, binding: DirectiveBinding) {
		formatDate(el, binding);
	},
};
