"use client";

import Link from "next/link";
import { useState } from "react";

import { PageViewTracker } from "@/components/PageViewTracker";
import { handleDemoUnavailableClick } from "@/lib/demo-unavailable";
import { useCart } from "@/lib/cart-store";
import { findProduct, formatPrice } from "@/lib/products";

const COUPONS: Record<string, { label: string; discount: number; min?: number }> = {
  WELCOME5000: { label: "신규 회원 5,000원 할인", discount: 5000 },
  NOTIFPLUS3K: { label: "NOTIF+ 3,000원 할인 (3만원 이상)", discount: 3000, min: 30000 },
};

export default function CartPage() {
  const { lines, subtotal, itemCount, setQuantity, remove, hydrated } = useCart();
  const [coupon, setCoupon] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const couponData = coupon && COUPONS[coupon];
  const couponValid = couponData && (!couponData.min || subtotal >= couponData.min);
  const discount = couponValid ? couponData.discount : 0;

  const shipping = subtotal === 0 ? 0 : subtotal - discount >= 30000 ? 0 : 3000;
  const expectedReward = Math.floor(Math.max(subtotal - discount + shipping, 0) * 0.01);
  const total = Math.max(subtotal - discount + shipping, 0);

  function applyCoupon(form: FormData) {
    const code = String(form.get("coupon") ?? "").trim().toUpperCase();
    if (!code) {
      setCouponError("쿠폰 코드를 입력해 주세요.");
      return;
    }
    const c = COUPONS[code];
    if (!c) {
      setCoupon("");
      setCouponError("등록되지 않은 쿠폰 코드입니다.");
      return;
    }
    if (c.min && subtotal < c.min) {
      setCoupon("");
      setCouponError(
        `이 쿠폰은 ${formatPrice(c.min)} 이상 결제 시 사용 가능합니다.`
      );
      return;
    }
    setCoupon(code);
    setCouponError(null);
  }

  return (
    <main className="page">
      <PageViewTracker page="cart" />
      <section className="page-head">
        <p className="eyebrow">CART</p>
        <h1>장바구니</h1>
        <p className="muted">총 {itemCount}개 상품</p>
      </section>

      {!hydrated ? (
        <p className="muted" style={{ padding: "60px 0" }}>장바구니를 불러오는 중…</p>
      ) : lines.length === 0 ? (
        <section className="empty-state">
          <h2>장바구니가 비어 있어요</h2>
          <p>좋아하는 상품을 담아두면 가격이 인하되거나 재입고될 때 알림을 보내드릴게요.</p>
          <Link href="/" className="btn primary">쇼핑 계속하기</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            <header className="cart-list-head">
              <span>상품 정보</span>
              <span>수량</span>
              <span>합계</span>
              <span></span>
            </header>
            {lines.map((line) => {
              const product = findProduct(line.productId);
              if (!product) return null;
              const lineTotal = product.price * line.quantity;
              return (
                <div className="cart-row" key={line.productId}>
                  <div className="cart-product">
                    <div className="cart-thumb" style={{ background: product.accentColor + "22" }}>
                      <span aria-hidden>{product.glyph}</span>
                    </div>
                    <div>
                      <p className="brand-name">{product.brand}</p>
                      <Link
                        href={`/?p=${product.id}`}
                        className="cart-name"
                        onClick={handleDemoUnavailableClick}
                      >
                        {product.name}
                      </Link>
                      <p className="cart-meta">
                        {formatPrice(product.price)}{" "}
                        {product.freeShipping && <span className="badge-line">무료배송</span>}
                      </p>
                    </div>
                  </div>
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, line.quantity - 1)}
                      aria-label="수량 줄이기"
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, line.quantity + 1)}
                      aria-label="수량 늘리기"
                    >
                      +
                    </button>
                  </div>
                  <strong className="line-total">{formatPrice(lineTotal)}</strong>
                  <button type="button" className="ghost compact" onClick={() => remove(product.id)}>
                    삭제
                  </button>
                </div>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h3>주문 요약</h3>
            <form
              className="coupon-form"
              onSubmit={(e) => {
                e.preventDefault();
                applyCoupon(new FormData(e.currentTarget));
              }}
            >
              <input name="coupon" placeholder="쿠폰 코드 (예: WELCOME5000)" defaultValue={coupon} />
              <button type="submit" className="ghost compact">적용</button>
            </form>
            {couponError && <p className="coupon-err">{couponError}</p>}
            {couponValid && couponData && (
              <p className="coupon-ok">{couponData.label} 적용됨 (−{formatPrice(couponData.discount)})</p>
            )}
            <dl>
              <div className="row"><dt>상품 금액</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="row"><dt>쿠폰 할인</dt><dd>−{formatPrice(discount)}</dd></div>
              <div className="row"><dt>배송비</dt><dd>{shipping === 0 ? "무료" : formatPrice(shipping)}</dd></div>
              <div className="row"><dt>예상 적립금 (1%)</dt><dd>+{formatPrice(expectedReward)}</dd></div>
              <div className="row total"><dt>결제 예정 금액</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            {subtotal > 0 && subtotal < 30000 && (
              <p className="ship-hint">+{formatPrice(30000 - subtotal)} 더 담으면 무료배송!</p>
            )}
            <Link href="/checkout" className="btn primary block">
              {formatPrice(total)} 결제하기
            </Link>
            <Link href="/" className="cart-back">← 쇼핑 계속하기</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
