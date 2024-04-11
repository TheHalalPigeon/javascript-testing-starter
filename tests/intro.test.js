import { 
  describe,
  it,
  expect
} from "vitest";

import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";

describe("max", () => {
  it("should return the first arg if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return the second arg if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });

  it("should return the first arg if args are equal", () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe("fizzBuzz", () => {
  it("should return Fizz if arg is divisible by 3", () => {
    expect(fizzBuzz(3)).toBe("Fizz");
  });

  it("should return Buzz if arg is divisible by 5", () => {
    expect(fizzBuzz(5)).toBe("Buzz");
  });

  it("should return FizzBuzz if arg is divisible by 15", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("should return the arg as a string if arg is not divisible by 3 or 5", () => {
    expect(fizzBuzz(17)).toBe("17");
  });
});

describe("calculateAverage", () => {
  it("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it("should calculate the average of an array of a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it("should calculate the average of an array of 2 elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it("should calculate the average of an array of 3 elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  it("should return 1 if arg is 0", () => {
    expect(factorial(0)).toBe(1);
  });

  it("should return 1 if arg is 1", () => {
    expect(factorial(1)).toBe(1);
  });

  it("should return 6 if arg is 3", () => {
    expect(factorial(3)).toBe(6);
  });

  it("should return 24 if arg is 4", () => {
    expect(factorial(4)).toBe(24);
  });

  it("should return 120 if arg is 5", () => {
    expect(factorial(5)).toBe(120);
  });

  it("should return undefined if arg is negative", () => {
    expect(factorial(-1)).toBe(undefined);
  });
});