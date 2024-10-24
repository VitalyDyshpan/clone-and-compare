/* eslint @typescript-eslint/no-explicit-any: "off" */
function checkSharedType(sample: any, target: any): false | "primitive" | "object" | "array" | "map" | "set" {
	// Проверяем совпадают ли типы сравниваемых объектов и возвращаем его при совпадении или false, если типы не совпадают
	const sampleType = typeof sample;
	const targetType = typeof target;
	if (sampleType !== targetType) return false;
	if (sampleType === "function" || targetType === "function") {
		throw new Error("Нельзя сравнивать функции");
	}
	if (sampleType === "object" && sample !== null && targetType === "object" && target !== null) {
		if (Array.isArray(sample) && Array.isArray(target)) {
			return "array";
		}
		if (sample instanceof Map && target instanceof Map) {
			return "map";
		}
		if (sample instanceof Set && target instanceof Set) {
			return "set";
		}
		return "object";
	}
	return "primitive";
}

function compareArrays(sample: any[], target: any[],  cache: WeakMap<object, boolean>): boolean {
	if (sample.length !== target.length) return false;
	cache.set(sample, true);
	for (let i = 0; i < target.length; ++i) {
		if (!compare(sample[i], target[i], cache)) {
			cache.set(sample, false);
			return false;
		}
	}
	return true;
}

function compareMaps(sample: Map<any, any>, target: Map<any, any>,  cache: WeakMap<object, boolean>): boolean {
	if (sample.size !== target.size) return false;
	const sampleEntries: [any, any][] = Array.from(sample.entries());
	const targetEntries: [any, any][] = Array.from(target.entries());
	cache.set(sample, true);
	for (let i = 0; i < targetEntries.length; ++i) {
		if (!compare(sampleEntries[i][0], targetEntries[i][0], cache) || !compare(sampleEntries[i][1], targetEntries[i][1], cache)) {
			cache.set(sample, false);
			return false;
		}
	}
	return true;
}

function compareSets(sample: Set<any>, target: Set<any>, cache: WeakMap<object, boolean>): boolean {
	if (sample.size !== target.size) return false;
	const sampleValues = Array.from(sample.values());
	const targetValues = Array.from(target.values());
	cache.set(sample, true);
	for (let i = 0; i < target.size; i++) {
		if (!compare(sampleValues[i], targetValues[i], cache)) {
			cache.set(sample, false);
			return false;
		}
	}
	return true;
}

function compareObjects(sample: Record<string, any>, target: Record<string, any>, cache: WeakMap<object, boolean>): boolean {
	const sampleKeys: string[] = Object.keys(sample);
	const targetKeys: string[] = Object.keys(target);
	if (sampleKeys.length !== targetKeys.length) return false;
	cache.set(sample, true);
	for (const key of targetKeys) {
		if (!(key in sample) || !compare(sample[key], target[key], cache)) {
			cache.set(sample, false);
			return false;
		}
	}
	return true;
}

export function compare(sample: any, target: any, compareCache = new WeakMap<object, boolean>()): boolean {
	if (sample === target) return true;
	if (compareCache.has(sample)) {
		return compareCache.get(sample)!;
	}
	const argumentsType: false | "primitive" | "object" | "array" | "map" | "set" = checkSharedType(sample, target);
	if (argumentsType) {
		switch (argumentsType) {
			case "primitive": {
				return sample === target;
			}
			case "array": {
				return compareArrays(sample, target, compareCache);
			}
			case "map": {
				return compareMaps(sample, target, compareCache);
			}
			case "set": {
				return compareSets(sample, target, compareCache);
			}
			case "object": {
				return compareObjects(sample, target, compareCache);
			}
		}
	}
	return false;
}