"use client";

import { useEffect, useRef } from "react";

import { createPageViewedEvent } from "@/lib/events";
import { trackStorefrontEvent } from "@/lib/notifly-client";
import { useNotiflyStatus } from "./NotiflyProvider";

type PageViewTrackerProps = {
  page: string;
};

export function PageViewTracker({ page }: PageViewTrackerProps) {
  const status = useNotiflyStatus();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || status.status !== "ready") return;
    sent.current = true;
    trackStorefrontEvent(createPageViewedEvent(page)).catch(() => undefined);
  }, [page, status.status]);

  return null;
}
