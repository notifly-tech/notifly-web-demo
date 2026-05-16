import { describe, expect, it } from "vitest";

import {
  eventNames,
  createCartAddedEvent,
  createCheckoutStartedEvent,
  createNewsletterSubscribedEvent,
  createNotificationPermissionEvent,
  createProductViewedEvent,
  createPurchaseCompletedEvent,
  createUserProfileUpdatedEvent,
} from "./events";

const serializedEventNames = eventNames.join(" ");

describe("storefront event taxonomy", () => {
  it("uses production-like event names without a demo prefix", () => {
    expect(eventNames).toEqual([
      "page_viewed",
      "user_profile_updated",
      "product_viewed",
      "product_added_to_cart",
      "checkout_started",
      "purchase_completed",
      "newsletter_subscribed",
      "notification_permission_cta_clicked",
    ]);
    expect(serializedEventNames).not.toContain("demo");
  });

  it("creates product viewed payloads", () => {
    expect(
      createProductViewedEvent({
        id: "lf-walnut-stand-01",
        name: "월넛 원목 플랜트 스탠드 (S)",
        category: "living",
        price: 39900,
      })
    ).toEqual({
      name: "product_viewed",
      params: {
        product_id: "lf-walnut-stand-01",
        product_name: "월넛 원목 플랜트 스탠드 (S)",
        category: "living",
        price: 39900,
        currency: "KRW",
      },
    });
  });

  it("creates cart and checkout payloads", () => {
    expect(
      createCartAddedEvent({
        product: {
          id: "kc-morning-blend-03",
          name: "데일리 모닝 블렌드",
          category: "kitchen",
          price: 16900,
        },
        quantity: 2,
        cartValue: 33800,
      })
    ).toEqual({
      name: "product_added_to_cart",
      params: {
        product_id: "kc-morning-blend-03",
        product_name: "데일리 모닝 블렌드",
        category: "kitchen",
        price: 16900,
        quantity: 2,
        cart_value: 33800,
        currency: "KRW",
      },
    });

    expect(createCheckoutStartedEvent({ cartValue: 33800, itemCount: 2 })).toEqual({
      name: "checkout_started",
      params: {
        cart_value: 33800,
        item_count: 2,
        currency: "KRW",
      },
    });
  });

  it("creates user, purchase, and notification payloads", () => {
    expect(
      createUserProfileUpdatedEvent({
        membershipTier: "premium",
        favoriteCategory: "lighting",
        marketingOptIn: true,
        lifecycleStage: "returning_user",
      })
    ).toEqual({
      name: "user_profile_updated",
      params: {
        membership_tier: "premium",
        favorite_category: "lighting",
        marketing_opt_in: true,
        lifecycle_stage: "returning_user",
      },
    });

    expect(createPurchaseCompletedEvent({ orderId: "order_123", revenue: 59000, itemCount: 3 })).toEqual({
      name: "purchase_completed",
      params: {
        order_id: "order_123",
        revenue: 59000,
        item_count: 3,
        currency: "KRW",
      },
    });

    expect(createNewsletterSubscribedEvent({ email: "hello@notif.shop", source: "footer" })).toEqual({
      name: "newsletter_subscribed",
      params: {
        source: "footer",
        email_domain: "notif.shop",
      },
    });

    expect(createNotificationPermissionEvent("notification_panel")).toEqual({
      name: "notification_permission_cta_clicked",
      params: {
        source: "notification_panel",
      },
    });
  });
});
