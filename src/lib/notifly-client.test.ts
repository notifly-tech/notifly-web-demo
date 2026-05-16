import { afterEach, describe, expect, it, vi } from "vitest";

import { buildNotiflyInitializeOptions } from "./notifly-client";
import type { StorefrontEvent } from "./events";

const originalProjectId = process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID;
const originalUsername = process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME;

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("notifly-js-sdk");
  vi.unstubAllGlobals();
  if (originalProjectId === undefined) {
    delete process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID;
  } else {
    process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID = originalProjectId;
  }
  if (originalUsername === undefined) {
    delete process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME;
  } else {
    process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME = originalUsername;
  }
});

describe("Notifly SDK initialization options", () => {
  it("passes a non-secret compatibility password without requiring user input", () => {
    const options = buildNotiflyInitializeOptions({
      ready: true,
      projectId: "0123456789abcdef0123456789abcdef",
      username: "project-user",
      allowUserSuppliedLogEvent: true,
    });

    expect(options).toEqual({
      projectId: "0123456789abcdef0123456789abcdef",
      username: "project-user",
      password: "not-used",
      allowUserSuppliedLogEvent: true,
    });
  });

  it("does not import or wait on the SDK when public configuration is missing", async () => {
    const trackEvent = vi.fn();
    vi.doMock("notifly-js-sdk", () => ({
      default: {
        initialize: vi.fn(),
        trackEvent,
      },
    }));
    vi.stubGlobal("window", {});
    delete process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME;

    const { trackStorefrontEvent } = await import("./notifly-client");
    const event: StorefrontEvent = { name: "page_viewed", params: { page: "home" } };

    await expect(trackStorefrontEvent(event)).rejects.toThrow("Notifly SDK is not ready");
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
