import { getNotiflyConfig, type MissingNotiflyConfig, type NotiflyConfig } from "./config";
import type { StorefrontEvent, UserProfileInput } from "./events";

type NotiflyModule = typeof import("notifly-js-sdk").default;

type InitializationResult =
  | {
      ready: true;
      config: NotiflyConfig;
    }
  | {
      ready: false;
      reason: "missing_config";
      config: MissingNotiflyConfig;
    }
  | {
      ready: false;
      reason: "not_browser" | "sdk_failed";
      message: string;
    };

let sdkPromise: Promise<NotiflyModule> | null = null;
let initializationPromise: Promise<InitializationResult> | null = null;

const sdkCompatibilityPassword = "not-used";

export function buildNotiflyInitializeOptions(config: NotiflyConfig) {
  return {
    projectId: config.projectId,
    username: config.username,
    password: sdkCompatibilityPassword,
    allowUserSuppliedLogEvent: config.allowUserSuppliedLogEvent,
  };
}

function loadSdk() {
  sdkPromise ??= import("notifly-js-sdk").then((module) => module.default);
  return sdkPromise;
}

export async function initializeNotifly(): Promise<InitializationResult> {
  if (typeof window === "undefined") {
    return {
      ready: false,
      reason: "not_browser",
      message: "브라우저 환경에서만 Notifly SDK를 초기화할 수 있습니다.",
    };
  }

  initializationPromise ??= (async () => {
    const config = getNotiflyConfig();

    if (!config.ready) {
      return {
        ready: false,
        reason: "missing_config",
        config,
      };
    }

    try {
      const notifly = await loadSdk();
      await notifly.initialize(buildNotiflyInitializeOptions(config));

      return {
        ready: true,
        config,
      };
    } catch (error) {
      return {
        ready: false,
        reason: "sdk_failed",
        message: error instanceof Error ? error.message : "알 수 없는 초기화 오류가 발생했습니다.",
      };
    }
  })();

  return initializationPromise;
}

async function getReadySdk() {
  const result = await initializeNotifly();
  if (!result.ready) {
    throw new Error("Notifly SDK is not ready.");
  }
  return loadSdk();
}

export async function trackStorefrontEvent(event: StorefrontEvent) {
  const notifly = await getReadySdk();
  await notifly.trackEvent(event.name, event.params);
}

export async function updateCustomerProfile(input: UserProfileInput & { userId: string; email?: string }) {
  const notifly = await getReadySdk();
  await notifly.setUserId(input.userId, { onlyIfChanged: true });
  await notifly.setUserProperties({
    membership_tier: input.membershipTier,
    favorite_category: input.favoriteCategory,
    marketing_opt_in: input.marketingOptIn,
    lifecycle_stage: input.lifecycleStage,
    ...(input.email ? { $email: input.email } : {}),
  });
}

export async function requestNotificationPermission(language: "ko" | "en" | "ja" | "zh" = "ko") {
  const notifly = await getReadySdk();
  await notifly.requestPermission(language);
}

export async function getCurrentUserId() {
  const notifly = await getReadySdk();
  return notifly.getUserId();
}
