import { vi, it, expect, describe } from "vitest";

import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";

import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return cost and time for the quote", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

    const info = getShippingInfo("London");

    expect(info).toMatch("$10");
    expect(info).toMatch(/2 days/i);
    expect(info).toMatch(/shipping cost: \$10 \(2 days\)/i);
  });

  it("should return shipping unavailible if there is no quote", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const info = getShippingInfo("London");

    expect(info).toMatch(/unavailable/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/);
  });

  it("should call analytics", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: 1234 };

  it("should charge the customer", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return success when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it("should return failed when payment is not successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  const email = "name@domain.com";

  it("should return false if email is not valid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(email);

    expect(result).toBe(true);
  });

  it("should send the welcome email if email is valid", async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];

    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("should email the one-time login code", async () => {
    const email = "name@domain.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe("isOnline", () => {
  it("should return false if current hour is outside opening hours", () => {
    vi.setSystemTime("2024-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour is within opening hours", () => {
    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return a discount on Christmas", () => {
    vi.setSystemTime("2024-12-25");
    expect(getDiscount()).toBe(0.2);
  });

  it("should return 0 on a normal day", () => {
    vi.setSystemTime("2024-12-24");
    expect(getDiscount()).toBe(0);
  });
});
