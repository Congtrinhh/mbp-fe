/**
 * Composable cung cấp các utility function để định dạng dữ liệu
 */

/**
 * Định dạng số thành tiền tệ VND
 * @param value - Giá trị cần định dạng (có thể là số hoặc null/undefined)
 * @returns Chuỗi đã được định dạng theo tiền tệ VND hoặc chuỗi rỗng nếu giá trị là null/undefined
 */
export function formatCurrency(value: number | null | undefined): string {
	if (value === null || value === undefined) return "-";
	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

/**
 * Composable cung cấp các utility function để định dạng dữ liệu
 */
export function useFormatter() {
	return {
		formatCurrency,
	};
}

export default useFormatter;
