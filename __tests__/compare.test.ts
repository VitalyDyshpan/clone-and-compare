import { expect, describe, it } from "vitest";
import { compare } from "~/utils/compare";

describe("compare tests", () => {
	it("should return true", () => {
		const sampleMap: Map<string, string> = new Map<string, string>([["1", "a"], ["2", "b"], ["3", "c"]]);
		const targetMap: Map<string, string> = new Map<string, string>([["1", "a"], ["2", "b"], ["3", "c"]]);

		const sampleArray: string[] = ["1", "b"];
		const targetArray: string[] = ["1", "b"];

		const sampleObject: Record<string, object> = {
			foo: {
				bar: "bar"
			},
		};

		const targetObject: Record<string, object> = {
			foo: {
				bar: "bar"
			},
		};

		const objAWithCircular: { value1: string, circular: unknown } = {
			value1: "value1",
			circular: undefined
		};

		const objBWithCircular: { value1: string, circular: unknown } = {
			value1: "value1",
			circular: undefined
		};

		objAWithCircular.circular = objBWithCircular;
		objBWithCircular.circular = objAWithCircular;

		const object = {
			value1: "value1"
		};

		const otherObject = object;

		const sampleSet: Set<unknown> = new Set<unknown>([sampleObject, "b"]);
		const targetSet: Set<unknown> = new Set<unknown>([targetObject, "b"]);

		const samplePrimitive: number = 10;
		const targetPrimitive: number = 10;

		expect(compare(sampleMap, targetMap)).toBe(true);
		expect(compare(sampleArray, targetArray)).toBe(true);
		expect(compare(sampleSet, targetSet)).toBe(true);
		expect(compare(samplePrimitive, targetPrimitive)).toBe(true);
		expect(compare(sampleObject, targetObject)).toBe(true);
		expect(compare(objAWithCircular, objBWithCircular)).toBe(true);
		expect(compare(object, otherObject)).toBe(true);
	});

	it("should return false", () => {
		const sampleMap: Map<string, string> = new Map<string, string>([["1", "a"], ["2", "b"], ["3", "c"]]);
		const targetMap: Map<string, string> = new Map<string, string>([["1", "d"], ["2", "e"], ["3", "f"]]);

		const sampleArray: string[] = ["1", "b"];
		const targetArray: number[] = [1, 2];

		const sampleSet: Set<unknown> = new Set<unknown>(["a", "b"]);
		const targetSet: Set<unknown> = new Set<unknown>(["c", "d"]);

		const samplePrimitive: number = 10;
		const targetPrimitive: string = "15";

		const sampleObject: Record<string, string> = {
			foo: "bar",
		};

		const targetObject: Record<string, string> = {
			bar: "baz",
		};

		const sampleObject2: Record<string, string> = {
			foo: "bar",
		};

		const targetObject2: Record<string, string> = {
			foo: "baz",
		};

		const objAWithCircular: { value1: string, circular: unknown } = {
			value1: "value1",
			circular: undefined
		};

		const objBWithCircular: { value1: string, circular: unknown } = {
			value1: "value2",
			circular: undefined
		};

		objAWithCircular.circular = objBWithCircular;
		objBWithCircular.circular = objAWithCircular;

		expect(compare(sampleMap, targetMap)).toBe(false);
		expect(compare(sampleArray, targetArray)).toBe(false);
		expect(compare(sampleSet, targetSet)).toBe(false);
		expect(compare(samplePrimitive, targetPrimitive)).toBe(false);
		expect(compare(sampleObject, targetObject)).toBe(false);
		expect(compare(sampleObject2, targetObject2)).toBe(false);
		expect(compare(objAWithCircular, objBWithCircular)).toBe(false);
	});
});