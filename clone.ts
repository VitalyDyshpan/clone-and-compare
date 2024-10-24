/* eslint @typescript-eslint/no-explicit-any: "off" */
type Primitive = string | number | boolean | null | undefined | symbol | bigint;
export type DeepClone<T> = T extends Primitive ? T
	: T extends Array<infer U> ? Array<DeepClone<U>>
		: T extends Map<infer K, infer V> ? Map<DeepClone<K>, DeepClone<V>>
			: T extends Set<infer U> ? Set<DeepClone<U>>
				: { [K in keyof T]: DeepClone<T[K]> };

type MapKeys<T> = Extract<keyof T, symbol | string>
type MapValues<T> = Extract<T[keyof T], any>

function cloneArray<T>(array: T[], cache: WeakMap<object, object>): DeepClone<T>[] {
	const clonedArray: DeepClone<T>[] = [];
	cache.set(array, clonedArray);
	array.forEach((value: T) => {
		clonedArray.push(clone(value, cache));
	});
	return clonedArray;
}

function cloneMap<K,V>(map: Map<K,V>, cache: WeakMap<object, object>): Map<DeepClone<K>,DeepClone<V>>{
	const clonedMap = new Map<DeepClone<K>, DeepClone<V>>();
	cache.set(map, clonedMap);
	map.forEach((value, key) => {
		clonedMap.set(clone(key, cache), clone(value, cache));
	});
	return clonedMap;
}

function cloneSet<T>(set: Set<T>, cache: WeakMap<object, object>): Set<DeepClone<T>> {
	const clonedSet = new Set<DeepClone<T>>();
	cache.set(set, clonedSet);
	set.forEach(value => {
		clonedSet.add(clone(value, cache));
	});
	return clonedSet;
}
export function clone<T>(sourceObject: T, cloneCache = new WeakMap<object, object>()): DeepClone<T> {
	if (typeof sourceObject === "object" && sourceObject !== null) {
		if (cloneCache.has(sourceObject)) {
			return cloneCache.get(sourceObject) as DeepClone<T>;
		}

		if (Array.isArray(sourceObject)) {
			return cloneArray<T>(sourceObject, cloneCache) as DeepClone<T>;
		}
		if (sourceObject instanceof Map) {
			return cloneMap<MapKeys<T>, MapValues<T>>(sourceObject, cloneCache) as DeepClone<T>;
		}

		if (sourceObject instanceof Set) {
			return cloneSet<T>(sourceObject, cloneCache) as DeepClone<T>;
		}

		const clonedObject = {} as { [K in keyof T]: DeepClone<T[K]> };
		cloneCache.set(sourceObject, clonedObject);
		Object.getOwnPropertySymbols(sourceObject).forEach(symbol => {
			clonedObject[symbol as keyof T] = clone(sourceObject[symbol as keyof T], cloneCache);
		});

		for (const k in sourceObject) {
			clonedObject[k as keyof T] = clone(sourceObject[k as keyof T], cloneCache);
		}
		return clonedObject as DeepClone<T>;
	}
	return sourceObject as DeepClone<T>;
}