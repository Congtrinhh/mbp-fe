export interface TimeConflictEventInfo {
	type: "CONFLICT" | "BUFFER";
	contractId: number;
	eventName: string;
	eventStart: string;
	eventEnd: string;
}
