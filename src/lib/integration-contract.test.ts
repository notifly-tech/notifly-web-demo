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

  it("keeps unsupported storefront links explicit instead of silently navigating", () => {
    const message = source("src/lib/demo-unavailable.ts");
    const header = source("src/components/SiteHeader.tsx");
    const home = source("src/app/page.tsx");
    const mypage = source("src/app/mypage/page.tsx");
    const footer = source("src/components/SiteFooter.tsx");
    const checkout = source("src/app/checkout/page.tsx");

    expect(message).toContain(
      "데모에서는 제공되지 않는 기능입니다. 장바구니 담기, 알림 받기, 뉴스레터 구독, 결제 완료 흐름을 사용해 보세요."
    );
    expect(header).toContain("onSubmit={handleDemoUnavailableClick}");
    expect(home).toContain("onClick={handleDemoUnavailableClick}");
    expect(mypage).toContain("onClick={handleDemoUnavailableClick}");
    expect(footer).toContain("onClick={handleDemoUnavailableClick}");
    expect(checkout).toContain("onClick={showDemoUnavailable}");
  });
});
