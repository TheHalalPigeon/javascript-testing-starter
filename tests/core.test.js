import { beforeEach, describe, expect, it } from "vitest";

import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array that is not empty", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it("should return objects with propeties of code and discount", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon).toBeTruthy();
    });
  });

  it("should return an array with valid discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle non-numeric prices", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle negative prices", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle non-string discount codes", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return a success message if both inputs are valid", () => {
    expect(validateUserInput("Ayat", 25)).toMatch(/success/i);
  });

  it("should handle non-string usernames", () => {
    expect(validateUserInput(69, 25)).toMatch(/invalid/i);
  });

  it("should handle usernames that have less than 3 characters", () => {
    expect(validateUserInput("", 25)).toMatch(/invalid/i);
  });

  it("should handle non-number ages", () => {
    expect(validateUserInput("Ayat", "13")).toMatch(/invalid/i);
  });

  it("should handle ages that are less than 18", () => {
    expect(validateUserInput("Ayat", 13)).toMatch(/invalid/i);
  });

  it("should return an error is both args are invalid", () => {
    expect(validateUserInput("", 13)).toMatch(/invalid username/i);
    expect(validateUserInput("", 13)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it.each([
    { scenario: "price < min", price: -10, result: false },
    { scenario: "price > max", price: 200, result: false },
    { scenario: "price = min", price: 0, result: true },
    { scenario: "price = max", price: 100, result: true },
    { scenario: "price between min and max", price: 50, result: true },
  ])("should return $result if $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });

  it("should return false if price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });

  it("should return true if price is equal to the min or to the max", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });

  it("should return true if price is within the range", () => {
    expect(isPriceInRange(50, 0, 100)).toBe(true);
  });
});

describe("isValidUsername", () => {
  it("should return false if the username is outside the range", () => {
    expect(isValidUsername("")).toBe(false);
    expect(isValidUsername("abcdefghijklmnopqrstuvwxyz")).toBe(false);
  });

  it("should return true if the username is equal to the min or to the max", () => {
    expect(isValidUsername("abcde")).toBe(true);
    expect(isValidUsername("abcdefghijklmno")).toBe(true);
  });

  it("should return true if the username is within the range", () => {
    expect(isValidUsername("TheHalalPigeon")).toBe(true);
  });

  it("should return false for invalid types", () => {
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("canDrive", () => {
  it("should return false for invalid types", () => {
    expect(canDrive("13", "UK")).toBe(false);
    expect(canDrive(13, 6)).toMatch(/invalid/i);
  });

  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])("should return $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

describe("fetchData", () => {
  it("should return a promise that will resolve to an array of numbers", async () => {
    try {
      await fetchData();
    } catch (err) {
      expect(err).toHaveProperty("reason");
      expect(err.reason).toMatch(/fail/i);
    }
  });
});

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("push should add an item to the stack", () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peek should return the top item from the stack without removing it", () => {
    stack.push(1);
    stack.push(2);

    const peekedItem = stack.peek();

    expect(peekedItem).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("isEmpty should return true if stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it("isEmpty should return false if stack is not empty", () => {
    stack.push(1);

    expect(stack.isEmpty()).toBe(false);
  });

  it("size should return the number of items in the stack", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.size()).toBe(2);
  });

  it("clear should remove all items in the stack", () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});
