export interface ApiErrorResponse {
	statusCode: number;
	message: string;
	additionalInfo: any[];
	traceId: string;
	timestamp: string;
}
