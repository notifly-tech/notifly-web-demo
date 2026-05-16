import { describe, expect, it } from "vitest";

import { calculateCartSubtotal, upsertCartLine, type CartLine } from "./cart-store";
import { findProduct } from "./products";

const lamp = findProduct("lt-pendant-lamp-09");
const mug = findProduct("kc-ceramic-mug-04");

if (!lamp || !mug) {
  throw new Error("Test fixture products are missing");
}

describe("cart event payload helpers", () => {
  it("computes the next cart lines before building Notifly cart_value", () => {
    const current: CartLine[] = [{ productId: mug.id, quantity: 2 }];
    const next = upsertCartLine(current, lamp, 1);

    expect(next).toEqual([
      { productId: mug.id, quantity: 2 },
      { productId: lamp.id, quantity: 1 },
    ]);
    expect(calculateCartSubtotal(next)).toBe(mug.price * 2 + lamp.price);
  });

  it("increments an existing line without mutating the previous cart", () => {
    const current: CartLine[] = [{ productId: lamp.id, quantity: 1 }];
    const next = upsertCartLine(current, lamp, 2);

    expect(current).toEqual([{ productId: lamp.id, quantity: 1 }]);
    expect(next).toEqual([{ productId: lamp.id, quantity: 3 }]);
    expect(calculateCartSubtotal(next)).toBe(lamp.price * 3);
  });
});
