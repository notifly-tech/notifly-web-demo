"use client";

import Link from "next/link";

import { PageViewTracker } from "@/components/PageViewTracker";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export default function Home() {
  const best = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "신상" || p.badge === "EARLY ACCESS");
  const exclusive = products.filter((p) => p.badge === "단독" || p.badge === "EARLY ACCESS");
  const todayPick = products.slice(0, 4);

  return (
    <main className="page">
      <PageViewTracker page="home" />
      {/* Hero */}
      <section className="hero-stage">
        <div className="hero-feature">
          <p className="hero-eyebrow">2025 SPRING EDITORIAL · ISSUE 12</p>
          <h1 className="hero-title">
            작은 무드의 변화로
            <br />
            매일이 달라집니다.
          </h1>
          <p className="hero-sub">
            3월의 식탁, 봄의 조도, 새 계절의 향. 노티프 MD가 큐레이션한 라이프스타일 셀렉션을
            매주 새롭게 만나보세요.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/?ed=editorial">
              이번 주 에디토리얼 →
            </Link>
            <Link className="btn ghost-light" href="/?cat=living">
              리빙 컬렉션 둘러보기
            </Link>
          </div>
          <div className="hero-pager">
            <span className="active">01</span>
            <span>02</span>
            <span>03</span>
            <span className="muted">/ 03</span>
          </div>
        </div>
        <aside className="hero-side">
          <div className="hero-promo light">
            <p className="kicker">이번 주 단독</p>
            <strong>OBJECT LAB 펜던트 라이트</strong>
            <p>회원 전용 EARLY ACCESS · 5월 31일까지</p>
            <Link href="/?p=lt-pendant-lamp-09">자세히 보기 →</Link>
          </div>
          <div className="hero-promo dark">
            <p className="kicker">MD INTERVIEW</p>
            <strong>도예가 김민영의 작업실</strong>
            <p>흙의 결을 닮은 그릇이 만들어지기까지</p>
            <Link href="/?ed=brand">매거진에서 읽기 →</Link>
          </div>
        </aside>
      </section>

      {/* Service strip */}
      <section className="service-strip">
        <div>
          <strong>오늘 출발</strong>
          <span>평일 오후 2시 이전 주문</span>
        </div>
        <div>
          <strong>3만원 이상 무료배송</strong>
          <span>일부 가구·조명 제외</span>
        </div>
        <div>
          <strong>30일 이내 교환·반품</strong>
          <span>고객 부담 없이</span>
        </div>
        <div>
          <strong>NOTIF+ 5% 추가 적립</strong>
          <span>월 무료배송 쿠폰 지급</span>
        </div>
      </section>

      {/* Category quick nav */}
      <section className="cat-quick">
        {categories.map((c) => (
          <Link key={c.value} href={`/?cat=${c.value}`} className="cat-quick-card">
            <span className="emoji" aria-hidden>{c.icon}</span>
            <span>{c.label}</span>
          </Link>
        ))}
      </section>

      {/* Weekly best ranking */}
      <section className="block">
        <header className="block-head">
          <div>
            <p className="eyebrow">WEEKLY BEST</p>
            <h2>이번 주 가장 많이 담은 베스트</h2>
          </div>
          <Link href="/?sort=best" className="block-more">전체 보기 →</Link>
        </header>
        <ol className="rank-list">
          {best.map((p, idx) => (
            <li key={p.id}>
              <span className="rank">{String(idx + 1).padStart(2, "0")}</span>
              <ProductCard product={p} />
            </li>
          ))}
        </ol>
      </section>

      {/* MD's pick */}
      <section className="block">
        <header className="block-head">
          <div>
            <p className="eyebrow">TODAY&rsquo;S PICK</p>
            <h2>오늘의 무드 큐레이션</h2>
          </div>
          <p className="block-sub">매주 수요일 새 큐레이션이 업데이트됩니다.</p>
        </header>
        <div className="product-grid">
          {todayPick.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="editorial-banner">
        <div>
          <p className="eyebrow">MAGAZINE</p>
          <h3>이번 봄, 책상 위의 빛을 다시 그립니다</h3>
          <p>
            사물의 결을 살리는 간접광, 무드를 만드는 조명 5선. 노티프의 라이팅 디렉터가 직접 골랐습니다.
          </p>
          <Link href="/?ed=lighting" className="btn ghost-light">
            매거진 읽기 →
          </Link>
        </div>
        <div className="editorial-art" aria-hidden>
          <span>光</span>
        </div>
      </section>

      {/* Exclusive */}
      <section className="block">
        <header className="block-head">
          <div>
            <p className="eyebrow">EXCLUSIVE</p>
            <h2>노티프 단독 입고</h2>
          </div>
          <p className="block-sub">국내에서는 노티프에서만 만날 수 있어요.</p>
        </header>
        <div className="product-grid">
          {exclusive.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New arrivals */}
      <section className="block">
        <header className="block-head">
          <div>
            <p className="eyebrow">NEW IN</p>
            <h2>이주의 신상 입고</h2>
          </div>
          <Link href="/?sort=new" className="block-more">전체 보기 →</Link>
        </header>
        <div className="product-grid">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Reviews wall */}
      <section className="reviews">
        <header className="block-head">
          <div>
            <p className="eyebrow">REAL REVIEW</p>
            <h2>고객들의 진짜 후기</h2>
          </div>
          <p className="block-sub">최근 30일 · 누적 평점 4.8 / 5.0 (28,420건)</p>
        </header>
        <div className="review-grid">
          <article>
            <div className="stars">★★★★★</div>
            <h4>“방의 분위기가 통째로 바뀌었어요”</h4>
            <p>저녁에 켜두면 카페에 온 듯한 무드. 케이블 정리도 깔끔합니다.</p>
            <span className="who">소프트 데스크 램프 · 김** 님</span>
          </article>
          <article>
            <div className="stars">★★★★★</div>
            <h4>“원두 향이 진짜 모닝 그 자체”</h4>
            <p>매일 핸드드립으로 마시는데 견과 풍미가 좋고, 배송도 빠릅니다.</p>
            <span className="who">데일리 모닝 블렌드 · 이** 님</span>
          </article>
          <article>
            <div className="stars">★★★★☆</div>
            <h4>“린넨 차렵이불, 여름 잘 보낼 듯”</h4>
            <p>워싱 처리가 잘 돼서 바로 덮어도 까슬하지 않아요. 색감 만족.</p>
            <span className="who">워싱 린넨 차렵이불 · 박** 님</span>
          </article>
        </div>
      </section>
    </main>
  );
}
