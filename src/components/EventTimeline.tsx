"use client";

import type { StorefrontEvent } from "@/lib/events";

type EventRecord = {
  id: string;
  event: StorefrontEvent;
  status: "sent" | "failed";
  createdAt: string;
};

type EventTimelineProps = {
  records: EventRecord[];
};

const eventLabels: Record<string, string> = {
  page_viewed: "페이지 진입",
  user_profile_updated: "내 정보 변경",
  product_viewed: "상품 상세 조회",
  product_added_to_cart: "장바구니 담기",
  checkout_started: "주문서 작성 시작",
  purchase_completed: "주문 완료",
  newsletter_subscribed: "뉴스레터 구독",
  notification_permission_cta_clicked: "알림 동의 요청",
};

export function EventTimeline({ records }: EventTimelineProps) {
  return (
    <section className="activity">
      <h3>
        <span>최근 활동</span>
        <small>실시간 마케팅 동기화 — Notifly</small>
      </h3>
      {records.length === 0 ? (
        <p className="activity-empty">
          아직 기록된 활동이 없습니다. 상품을 조회하거나 장바구니에 담으면 여기에 표시됩니다.
        </p>
      ) : (
        <ol className="activity-list">
          {records.map((record) => {
            const label = eventLabels[record.event.name] ?? record.event.name;
            return (
              <li key={record.id} className={record.status}>
                <span className="time">{record.createdAt}</span>
                <span className="label">
                  {label}
                  <span className="code">{record.event.name}</span>
                </span>
                <span className="status">{record.status === "sent" ? "전송됨" : "실패"}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export type { EventRecord };
