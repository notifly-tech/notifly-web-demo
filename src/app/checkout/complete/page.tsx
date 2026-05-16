"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageViewTracker } from "@/components/PageViewTracker";

function CompleteInner() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "MS000000000";
  const total = Number(params.get("total") ?? "0");

  return (
    <main className="page">
      <PageViewTracker page="checkout_complete" />
      <section className="complete-card">
        <div className="check-circle" aria-hidden>✓</div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1>주문이 정상적으로 접수되었습니다</h1>
        <p className="muted">주문 번호 · {orderId}</p>
        <dl className="complete-summary">
          <div>
            <dt>결제 금액</dt>
            <dd>{Intl.NumberFormat("ko-KR").format(total)}원</dd>
          </div>
          <div>
            <dt>예상 도착</dt>
            <dd>2~3일 (평일 기준)</dd>
          </div>
          <div>
            <dt>배송 상태</dt>
            <dd>주문 확인 중</dd>
          </div>
        </dl>
        <p className="muted small">
          결제 영수증과 배송 추적 링크는 등록된 이메일과 알림으로 전달됩니다.
          상품이 출고되면 다시 한 번 알려드릴게요.
        </p>
        <div className="complete-actions">
          <Link href="/mypage" className="btn primary">주문 내역 보기</Link>
          <Link href="/" className="btn ghost-light">쇼핑 계속하기</Link>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <CompleteInner />
    </Suspense>
  );
}
