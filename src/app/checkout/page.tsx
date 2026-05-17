"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useCart } from "@/lib/cart-store";
import { PageViewTracker } from "@/components/PageViewTracker";
import { useNotiflyStatus } from "@/components/NotiflyProvider";
import { showDemoUnavailable } from "@/lib/demo-unavailable";
import { findProduct, formatPrice } from "@/lib/products";
import {
  createCheckoutStartedEvent,
  createPurchaseCompletedEvent,
} from "@/lib/events";
import { trackStorefrontEvent } from "@/lib/notifly-client";

const PAY_METHODS = ["신용·체크카드", "카카오페이", "네이버페이", "토스페이", "무통장 입금"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, itemCount, clear, hydrated } = useCart();
  const status = useNotiflyStatus();
  const sentCheckoutStart = useRef(false);

  const [name, setName] = useState("조민규");
  const [phone, setPhone] = useState("010-1234-5678");
  const [zip, setZip] = useState("06248");
  const [address1, setAddress1] = useState("서울 강남구 역삼로 172");
  const [address2, setAddress2] = useState("주식회사 그레이박스");
  const [memo, setMemo] = useState("부재 시 경비실에 맡겨주세요.");
  const [pay, setPay] = useState<typeof PAY_METHODS[number]>("카카오페이");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal === 0 ? 0 : subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;
  const expectedReward = Math.floor(total * 0.01);

  useEffect(() => {
    if (!hydrated) return;
    if (status.status !== "ready") return;
    if (sentCheckoutStart.current) return;
    if (lines.length === 0) return;
    sentCheckoutStart.current = true;
    trackStorefrontEvent(createCheckoutStartedEvent({ cartValue: subtotal, itemCount })).catch(() => undefined);
  }, [hydrated, status.status, lines.length, subtotal, itemCount]);

  const summaryLines = useMemo(
    () =>
      lines
        .map((line) => {
          const p = findProduct(line.productId);
          return p ? { product: p, quantity: line.quantity } : null;
        })
        .filter(Boolean) as { product: NonNullable<ReturnType<typeof findProduct>>; quantity: number }[],
    [lines]
  );

  if (hydrated && lines.length === 0) {
    return (
      <main className="page">
        <PageViewTracker page="checkout" />
        <section className="page-head">
          <p className="eyebrow">CHECKOUT</p>
          <h1>주문서 작성</h1>
        </section>
        <section className="empty-state">
          <h2>주문할 상품이 없어요</h2>
          <p>장바구니에 상품을 담은 후 다시 시도해 주세요.</p>
          <Link href="/" className="btn primary">쇼핑 계속하기</Link>
        </section>
      </main>
    );
  }

  async function handleSubmit() {
    if (!agreed) return;
    setSubmitting(true);
    const orderId = `MS${Date.now().toString().slice(-9)}`;
    try {
      await trackStorefrontEvent(
        createPurchaseCompletedEvent({ orderId, revenue: total, itemCount })
      );
    } catch {
      // best effort
    }
    clear();
    router.push(`/checkout/complete?order=${orderId}&total=${total}`);
  }

  return (
    <main className="page">
      <PageViewTracker page="checkout" />
      <section className="page-head">
        <p className="eyebrow">CHECKOUT</p>
        <h1>주문서 작성</h1>
        <p className="muted">배송지와 결제 수단을 확인해주세요.</p>
      </section>

      <div className="checkout-layout">
        <section className="checkout-main">
          <div className="form-block">
            <h3>주문자 정보</h3>
            <div className="form-grid">
              <label>주문자 이름<input value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>휴대폰 번호<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            </div>
          </div>

          <div className="form-block">
            <h3>배송지</h3>
            <div className="form-grid">
              <label className="span-1">우편번호<input value={zip} onChange={(e) => setZip(e.target.value)} /></label>
              <label className="span-1">
                <span>&nbsp;</span>
                <button type="button" className="ghost compact" onClick={showDemoUnavailable}>주소 검색</button>
              </label>
              <label className="span-2">기본 주소<input value={address1} onChange={(e) => setAddress1(e.target.value)} /></label>
              <label className="span-2">상세 주소<input value={address2} onChange={(e) => setAddress2(e.target.value)} /></label>
              <label className="span-2">배송 메모<input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 문 앞에 두고 노크해 주세요" /></label>
            </div>
          </div>

          <div className="form-block">
            <h3>주문 상품 ({summaryLines.length}건)</h3>
            <ul className="checkout-items">
              {summaryLines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <div className="cart-thumb sm" style={{ background: product.accentColor + "22" }}>
                    <span aria-hidden>{product.glyph}</span>
                  </div>
                  <div>
                    <p className="brand-name">{product.brand}</p>
                    <p className="checkout-name">{product.name}</p>
                    <p className="cart-meta">수량 {quantity}개 · {formatPrice(product.price * quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-block">
            <h3>결제 수단</h3>
            <div className="pay-grid">
              {PAY_METHODS.map((m) => (
                <label key={m} className={`pay-option ${pay === m ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="pay"
                    value={m}
                    checked={pay === m}
                    onChange={() => setPay(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="checkout-summary">
          <h3>결제 요약</h3>
          <dl>
            <div className="row"><dt>상품 금액</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="row"><dt>배송비</dt><dd>{shipping === 0 ? "무료" : formatPrice(shipping)}</dd></div>
            <div className="row"><dt>예상 적립금</dt><dd>+{formatPrice(expectedReward)}</dd></div>
            <div className="row total"><dt>최종 결제 금액</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <label className="agree">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              주문 내용을 확인했고, 약관 및 개인정보 제3자 제공에 동의합니다.
            </span>
          </label>
          <button
            type="button"
            className="btn primary block"
            disabled={!agreed || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "결제 처리 중…" : `${formatPrice(total)} 결제하기`}
          </button>
          <Link href="/cart" className="cart-back">← 장바구니로 돌아가기</Link>
        </aside>
      </div>
    </main>
  );
}
