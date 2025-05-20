import type { BaseEntity } from "@/entities/baseEntity";
import { EntityState } from "@/enums/entityState";

export function useEntity() {
	function updateEntityState<T extends BaseEntity>(currentList: T[], originalList: T[]): T[] {
		const updatedList = currentList.map((current) => {
			const original = originalList.find((o) => o.id === current.id);
			if (!original) return { ...current, entityState: EntityState.Add };

			const hasChanges = Object.keys(current).some((key) => current[key as keyof T] !== original[key as keyof T]);
			return hasChanges
				? { ...current, entityState: EntityState.Update }
				: { ...current, entityState: EntityState.None };
		});

		const removedItems = originalList
			.filter((o) => !currentList.some((c) => c.id === o.id))
			.map((o) => ({ ...o, entityState: EntityState.Delete }));

		return [...updatedList, ...removedItems];
	}

	return { updateEntityState };
}
