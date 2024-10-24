import { describe, expect, it } from "vitest";
import { clone } from "~/utils/clone";

describe("clone tests", () => {
	let testObject;
	it("should return copy of primitive", () => {
		testObject = "string";
		expect(clone(testObject)).toStrictEqual(testObject);
		testObject = 10;
		expect(clone(testObject)).toStrictEqual(testObject);
		testObject = false;
		expect(clone(testObject)).toStrictEqual(testObject);
	});
	it("should return array copy", () => {
		testObject = ["string", 10, true];
		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
	});
	it("should return object copy", () => {
		testObject = {
			value: "value"
		};
		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
	});
	it("should return array with objects", () => {
		const arrayObject1 = {
			value1: "value 1"
		};
		const arrayObject2 = {
			value2: "value 2"
		};

		testObject = [arrayObject1, arrayObject2];

		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
		expect(copy[0] === arrayObject1).toBe(false);
		expect(copy[1] === arrayObject2).toBe(false);
	});
	it("should return object with object copy", () => {
		const nestedObject = {
			nestedValue: "Value"
		};
		testObject = {
			value1: "value1",
			nestedObject
		};
		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
		expect(copy.nestedObject === nestedObject).toBe(false);
	});
	it("should return Map copy", () => {
		testObject = new Map();
		testObject.set("key", "value");
		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
	});
	it("should return Set copy", () => {
		testObject = new Set();
		testObject.add("value");

		const copy = clone(testObject);
		expect(copy).toStrictEqual(testObject);
		expect(copy === testObject).toBe(false);
	});
	it("should return object with cyclical links", () => {
		const objA: { b: undefined | { a: typeof objB.a} } = {
			b: undefined
		};
		const objB: { a: undefined | { b: typeof objA.b} } = {
			a: undefined
		};
		objA.b = objB;
		objB.a = objA;

		const mapA = new Map<unknown, unknown>();
		const mapB = new Map<unknown, unknown>();

		mapA.set("keyB", mapB);
		mapB.set("keyA", mapA);

		const setA = new Set<unknown>();
		const setB = new Set<unknown>();

		setA.add(setB);
		setB.add(setA);

		const arrayA: unknown[] = ["a", "b"];
		const arrayB: unknown[] = ["c", "d"];

		arrayA.push(arrayB);
		arrayB.push(arrayA);

		const resultA = clone(objA);
		const resultB = clone(objB);

		const resultMapA = clone(mapA);
		const resultMapB = clone(mapB);

		const resultSetA = clone(setA);
		const resultSetB = clone(setB);

		const resultArrayA = clone(arrayA);
		const resultArrayB = clone(arrayB);

		expect(resultA).toStrictEqual(objA);
		expect(resultA === objA).toBe(false);
		expect(resultB).toStrictEqual(objB);
		expect(resultB === objB).toBe(false);
		expect(resultMapA).toStrictEqual(mapA);
		expect(resultMapB).toStrictEqual(mapB);
		expect(resultSetA).toStrictEqual(setA);
		expect(resultSetB).toStrictEqual(setB);
		expect(resultArrayA).toStrictEqual(arrayA);
		expect(resultArrayB).toStrictEqual(arrayB);
	});
});