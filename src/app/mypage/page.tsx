"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { UserProfilePanel } from "@/components/UserProfilePanel";
import { handleDemoUnavailableClick } from "@/lib/demo-unavailable";
import { EventTimeline, type EventRecord } from "@/components/EventTimeline";
import { PageViewTracker } from "@/components/PageViewTracker";
import { PushPermissionPanel } from "@/components/PushPermissionPanel";
import { useNotiflyStatus } from "@/components/NotiflyProvider";
import {
  createNotificationPermissionEvent,
  createUserProfileUpdatedEvent,
  type StorefrontEvent,
  type UserProfileInput,
} from "@/lib/events";
import {
  requestNotificationPermission,
  trackStorefrontEvent,
  updateCustomerProfile,
} from "@/lib/notifly-client";

type UserProfileForm = UserProfileInput & { userId: string; email: string };

function createRecord(event: StorefrontEvent, statusType: EventRecord["status"]): EventRecord {
  return {
    id: `${event.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event,
    status: statusType,
    createdAt: new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date()),
  };
}

export default function MyPage() {
  const status = useNotiflyStatus();
  const [records, setRecords] = useState<EventRecord[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported" | "unknown">("unknown");

  const isReady = status.status === "ready";

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function recordEvent(event: StorefrontEvent) {
    try {
      await trackStorefrontEvent(event);
      setRecords((prev) => [createRecord(event, "sent"), ...prev].slice(0, 12));
    } catch {
      setRecords((prev) => [createRecord(event, "failed"), ...prev].slice(0, 12));
    }
  }

  async function handleProfileSave(profile: UserProfileForm) {
    await updateCustomerProfile(profile);
    await recordEvent(createUserProfileUpdatedEvent(profile));
  }

  async function handleRequestPermission() {
    await recordEvent(createNotificationPermissionEvent("mypage"));
    await requestNotificationPermission("ko");
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }

  return (
    <main className="page">
      <PageViewTracker page="mypage" />
      <section className="page-head">
        <p className="eyebrow">MY NOTIF</p>
        <h1>마이페이지</h1>
        <p className="muted">최근 활동, 맞춤 추천 설정, 알림을 한 곳에서 관리하세요.</p>
      </section>

      <section className="mypage-grid">
        <div className="mypage-stat">
          <p>최근 30일 주문</p>
          <strong>2건</strong>
        </div>
        <div className="mypage-stat">
          <p>적립금</p>
          <strong>3,420원</strong>
        </div>
        <div className="mypage-stat">
          <p>사용 가능한 쿠폰</p>
          <strong>3장</strong>
        </div>
        <div className="mypage-stat">
          <p>찜한 상품</p>
          <strong>12개</strong>
        </div>
      </section>

      <section className="mypage-quicklinks">
        <Link href="/cart">장바구니</Link>
        <Link href="#" onClick={handleDemoUnavailableClick}>주문 내역</Link>
        <Link href="#" onClick={handleDemoUnavailableClick}>배송 조회</Link>
        <Link href="#" onClick={handleDemoUnavailableClick}>교환·반품 신청</Link>
        <Link href="#" onClick={handleDemoUnavailableClick}>쿠폰함</Link>
        <Link href="#" onClick={handleDemoUnavailableClick}>1:1 문의</Link>
      </section>

      <section className="block">
        <UserProfilePanel onSave={handleProfileSave} disabled={!isReady} />
      </section>

      <section className="block">
        <PushPermissionPanel
          permission={permission}
          onRequestPermission={handleRequestPermission}
          disabled={!isReady}
        />
      </section>

      <section className="block">
        <EventTimeline records={records} />
      </section>
    </main>
  );
}
