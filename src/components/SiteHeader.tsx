"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/lib/cart-store";
import { categories } from "@/lib/products";

export function SiteHeader() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const announcements = useMemo(
    () => [
      "신규 회원 가입 시 5,000원 즉시 할인 쿠폰 지급",
      "평일 오후 2시 이전 주문 시 오늘 출발",
      "NOTIF+ 멤버 추가 5% 적립 · 매월 무료배송 쿠폰",
    ],
    []
  );

  return (
    <header className={`top-bar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="announce-bar">
        <div className="announce-track">
          {announcements.concat(announcements).map((line, idx) => (
            <span key={idx}>{line}</span>
          ))}
        </div>
      </div>

      <div className="top-bar-inner">
        <Link className="brand" href="/">
          NOTIF
          <small>오늘의 무드, 내일의 일상</small>
        </Link>

        <div className="search-bar">
          <span aria-hidden>⌕</span>
          <input
            type="search"
            placeholder="브랜드, 상품, 컬러로 검색해 보세요"
            aria-label="상품 검색"
          />
        </div>

        <div className="top-utility">
          <Link href="/mypage">마이페이지</Link>
          <Link href="/cart" className="utility-cart" aria-label={`장바구니 ${itemCount}개`}>
            장바구니
            <span className="utility-count">{itemCount}</span>
          </Link>
        </div>
      </div>

      <nav className="cat-nav" aria-label="카테고리">
        <Link href="/" className="is-active">홈</Link>
        <Link href="/?sort=new">신상품</Link>
        <Link href="/?sort=best">베스트</Link>
        {categories.map((c) => (
          <Link key={c.value} href={`/?cat=${c.value}`}>
            {c.label}
          </Link>
        ))}
        <Link href="/?ed=magazine">매거진</Link>
        <Link href="/?ed=brand">브랜드</Link>
      </nav>
    </header>
  );
}
