import type { ProductCategory } from "./products";

type ProductLike = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
};

export const eventNames = [
  "page_viewed",
  "user_profile_updated",
  "product_viewed",
  "product_added_to_cart",
  "checkout_started",
  "purchase_completed",
  "newsletter_subscribed",
  "notification_permission_cta_clicked",
] as const;

export type StorefrontEventName = (typeof eventNames)[number];

export type StorefrontEvent = {
  name: StorefrontEventName;
  params: Record<string, string | number | boolean>;
};

export type MembershipTier = "free" | "premium";
export type LifecycleStage = "new_user" | "returning_user";

export type UserProfileInput = {
  membershipTier: MembershipTier;
  favoriteCategory: ProductCategory;
  marketingOptIn: boolean;
  lifecycleStage: LifecycleStage;
};

const currency = "KRW";

export function createPageViewedEvent(page: string): StorefrontEvent {
  return {
    name: "page_viewed",
    params: {
      page,
    },
  };
}

export function createUserProfileUpdatedEvent(input: UserProfileInput): StorefrontEvent {
  return {
    name: "user_profile_updated",
    params: {
      membership_tier: input.membershipTier,
      favorite_category: input.favoriteCategory,
      marketing_opt_in: input.marketingOptIn,
      lifecycle_stage: input.lifecycleStage,
    },
  };
}

export function createProductViewedEvent(product: ProductLike): StorefrontEvent {
  return {
    name: "product_viewed",
    params: {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      currency,
    },
  };
}

export function createCartAddedEvent(input: {
  product: ProductLike;
  quantity: number;
  cartValue: number;
}): StorefrontEvent {
  return {
    name: "product_added_to_cart",
    params: {
      product_id: input.product.id,
      product_name: input.product.name,
      category: input.product.category,
      price: input.product.price,
      quantity: input.quantity,
      cart_value: input.cartValue,
      currency,
    },
  };
}

export function createCheckoutStartedEvent(input: { cartValue: number; itemCount: number }): StorefrontEvent {
  return {
    name: "checkout_started",
    params: {
      cart_value: input.cartValue,
      item_count: input.itemCount,
      currency,
    },
  };
}

export function createPurchaseCompletedEvent(input: {
  orderId: string;
  revenue: number;
  itemCount: number;
}): StorefrontEvent {
  return {
    name: "purchase_completed",
    params: {
      order_id: input.orderId,
      revenue: input.revenue,
      item_count: input.itemCount,
      currency,
    },
  };
}

export function createNewsletterSubscribedEvent(input: { email: string; source: string }): StorefrontEvent {
  const emailDomain = input.email.split("@")[1]?.trim().toLowerCase() || "unknown";

  return {
    name: "newsletter_subscribed",
    params: {
      source: input.source,
      email_domain: emailDomain,
    },
  };
}

export function createNotificationPermissionEvent(source: string): StorefrontEvent {
  return {
    name: "notification_permission_cta_clicked",
    params: {
      source,
    },
  };
}
