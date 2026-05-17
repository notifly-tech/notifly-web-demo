"use client";

import Link from "next/link";
import { useState } from "react";

import { handleDemoUnavailableClick } from "@/lib/demo-unavailable";
import { trackStorefrontEvent } from "@/lib/notifly-client";
import { createProductViewedEvent } from "@/lib/events";
import { formatPrice, formatPriceCompact, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleHoverView() {
    try {
      await trackStorefrontEvent(createProductViewedEvent(product));
    } catch {
      // SDK not ready
    }
  }

  async function handleAdd() {
    setAdding(true);
    try {
      await add(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="product-card" onMouseEnter={handleHoverView}>
      <Link
        href={`/?p=${product.id}`}
        className="thumb-link"
        aria-label={product.name}
        onClick={handleDemoUnavailableClick}
      >
        <div className="thumb" style={{ background: shadeBackground(product.accentColor) }}>
          <div className="thumb-bg" aria-hidden>
            {product.glyph}
          </div>
          {product.badge && (
            <span className={`thumb-badge${product.badge === "단독" || product.badge === "EARLY ACCESS" ? "" : " soft"}`}>
              {product.badge}
            </span>
          )}
          {product.freeShipping && <span className="thumb-ship">무료배송</span>}
        </div>
      </Link>
      <p className="brand-name">{product.brand}</p>
      <h3>{product.name}</h3>
      <div className="price-row">
        <span className="discount">{product.discountRate}%</span>
        <span className="price">{formatPrice(product.price)}</span>
        <span className="strike">{formatPriceCompact(product.originalPrice)}</span>
      </div>
      <div className="review">
        <span className="star">★</span>
        <span>
          {product.rating.toFixed(1)} · 리뷰 {product.reviewCount.toLocaleString("ko-KR")}
        </span>
      </div>
      <div className="card-actions">
        <button
          type="button"
          className="ghost compact"
          onClick={handleAdd}
          disabled={adding}
        >
          {added ? "담겼어요" : adding ? "담는 중…" : "장바구니 담기"}
        </button>
      </div>
    </article>
  );
}

function shadeBackground(accent: string): string {
  return `linear-gradient(180deg, ${hexToRgba(accent, 0.06)} 0%, ${hexToRgba(accent, 0.16)} 100%)`;
}

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
