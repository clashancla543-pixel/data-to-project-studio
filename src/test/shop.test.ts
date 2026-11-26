import { describe, it, expect } from "vitest";
import { shipping, subtotal } from "@/lib/shop";

describe("shipping", () => {
  it("is free at ₹999 and above", () => { expect(shipping(999)).toBe(0); expect(shipping(1500)).toBe(0); });
  it("charges below ₹999", () => { expect(shipping(998)).toBeGreaterThan(0); });
});
describe("subtotal", () => {
  it("multiplies price by quantity", () => { expect(subtotal([{ id: "nitro-red", size: "5ml", qty: 2 }])).toBe(498); });
});
