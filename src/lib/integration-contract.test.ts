import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function source(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("Notifly integration contract after storefront redesign", () => {
  it.each([
    ["src/app/page.tsx", "home"],
    ["src/app/cart/page.tsx", "cart"],
    ["src/app/checkout/page.tsx", "checkout"],
    ["src/app/checkout/complete/page.tsx", "checkout_complete"],
    ["src/app/mypage/page.tsx", "mypage"],
  ])("tracks page_viewed for %s", (filePath, pageName) => {
    const body = source(filePath);

    expect(body).toContain("PageViewTracker");
    expect(body).toContain(`page=\"${pageName}\"`);
  });

  it("keeps the Notifly status dock visible without a hidden debug query gate", () => {
    const body = source("src/components/FloatingDebugDock.tsx");

    expect(body).not.toContain("params.get(\"debug\")");
    expect(body).not.toContain("return null");
  });

  it("records the new newsletter conversion path with Notifly", () => {
    const body = source("src/components/NewsletterForm.tsx");

    expect(body).toContain("createNewsletterSubscribedEvent");
    expect(body).toContain("trackStorefrontEvent");
  });
});
