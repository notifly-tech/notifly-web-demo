import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getNotiflyConfig, validateProjectId } from "./config";

describe("Notifly configuration", () => {
  it("validates a 32-character hex project id", () => {
    expect(validateProjectId("0123456789abcdef0123456789abcdef")).toBe(true);
    expect(validateProjectId("not-a-project-id")).toBe(false);
    expect(validateProjectId("0123456789abcdef0123456789abcdeg")).toBe(false);
  });

  it("returns a ready config without a project password", () => {
    expect(
      getNotiflyConfig({
        NEXT_PUBLIC_NOTIFLY_PROJECT_ID: "0123456789abcdef0123456789abcdef",
        NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME: "project-user",
      })
    ).toEqual({
      ready: true,
      projectId: "0123456789abcdef0123456789abcdef",
      username: "project-user",
      allowUserSuppliedLogEvent: false,
    });
  });

  it("returns missing fields without exposing secret values", () => {
    expect(
      getNotiflyConfig({
        NEXT_PUBLIC_NOTIFLY_PROJECT_ID: "bad-id",
      })
    ).toEqual({
      ready: false,
      missingFields: ["NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME"],
      invalidFields: ["NEXT_PUBLIC_NOTIFLY_PROJECT_ID"],
    });
  });

  it("keeps public env variables statically visible to the Next.js client compiler", () => {
    const source = readFileSync(new URL("./config.ts", import.meta.url), "utf8");

    expect(source).toContain("process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID");
    expect(source).toContain("process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME");
    expect(source).toContain("process.env.NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT");
    expect(source).not.toContain("environment: Environment = process.env");
  });
});
