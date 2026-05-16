export type ProductCategory =
  | "living"
  | "lighting"
  | "kitchen"
  | "bedding"
  | "fragrance"
  | "stationery";

export type Product = {
  id: string;
  brand: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountRate: number;
  reviewCount: number;
  rating: number;
  tags?: string[];
  badge?: "단독" | "신상" | "베스트" | "리오더" | "EARLY ACCESS";
  freeShipping?: boolean;
  accentColor: string;
  glyph: string;
};

export const products: Product[] = [
  {
    id: "lf-walnut-stand-01",
    brand: "NOTIF STUDIO",
    name: "월넛 원목 플랜트 스탠드 (S)",
    description: "거실 한 켠에 놓기 좋은 월넛 원목 플랜트 스탠드.",
    category: "living",
    price: 39900,
    originalPrice: 56000,
    discountRate: 29,
    reviewCount: 1284,
    rating: 4.8,
    badge: "베스트",
    freeShipping: true,
    accentColor: "#5b3a22",
    glyph: "잎",
    tags: ["MD's PICK", "이주의 베스트"],
  },
  {
    id: "lt-soft-desk-lamp-02",
    brand: "OBJECT LAB",
    name: "소프트 데스크 램프 — 마쉬멜로우",
    description: "은은한 간접광으로 책상 위 무드를 완성합니다.",
    category: "lighting",
    price: 49000,
    originalPrice: 69000,
    discountRate: 29,
    reviewCount: 642,
    rating: 4.7,
    badge: "단독",
    freeShipping: true,
    accentColor: "#6f5cc2",
    glyph: "光",
    tags: ["단독 입고"],
  },
  {
    id: "kc-morning-blend-03",
    brand: "DAILY ROAST",
    name: "데일리 모닝 블렌드 원두 200g",
    description: "라이트한 산미와 견과 풍미의 미디엄 로스팅.",
    category: "kitchen",
    price: 16900,
    originalPrice: 22000,
    discountRate: 23,
    reviewCount: 3120,
    rating: 4.9,
    badge: "리오더",
    accentColor: "#9a5a34",
    glyph: "豆",
    tags: ["리뷰 3000+"],
  },
  {
    id: "kc-ceramic-mug-04",
    brand: "STILL HOUSE",
    name: "스틸하우스 머그 320ml — 오트",
    description: "도자기 본연의 결을 살린 핸드메이드 머그.",
    category: "kitchen",
    price: 22000,
    originalPrice: 28000,
    discountRate: 21,
    reviewCount: 487,
    rating: 4.6,
    badge: "신상",
    accentColor: "#c06c49",
    glyph: "盃",
  },
  {
    id: "lf-rattan-side-table-05",
    brand: "ATELIER NOON",
    name: "라탄 사이드 테이블 — 내추럴",
    description: "한 손으로 들어 옮기기 좋은 가벼운 사이드 테이블.",
    category: "living",
    price: 89000,
    originalPrice: 119000,
    discountRate: 25,
    reviewCount: 832,
    rating: 4.7,
    freeShipping: true,
    accentColor: "#a07a4f",
    glyph: "椅",
    tags: ["주말 특가"],
  },
  {
    id: "bd-linen-cover-06",
    brand: "FOLD HOME",
    name: "워싱 린넨 차렵이불 — 미스트 그레이",
    description: "서늘한 촉감의 워싱 린넨 차렵이불, 슈퍼싱글/퀸.",
    category: "bedding",
    price: 119000,
    originalPrice: 159000,
    discountRate: 25,
    reviewCount: 1956,
    rating: 4.9,
    badge: "베스트",
    freeShipping: true,
    accentColor: "#7c8aa3",
    glyph: "綿",
    tags: ["MD's PICK"],
  },
  {
    id: "fg-candle-cedarwood-07",
    brand: "MAISON SOIE",
    name: "메종 수아 캔들 — 시더우드 220g",
    description: "삼나무 숲의 깊은 잔향, 약 50시간 연소.",
    category: "fragrance",
    price: 34000,
    originalPrice: 42000,
    discountRate: 19,
    reviewCount: 728,
    rating: 4.8,
    accentColor: "#3f5a3a",
    glyph: "香",
    tags: ["기프트 추천"],
  },
  {
    id: "fg-diffuser-citrus-08",
    brand: "MAISON SOIE",
    name: "시트러스 베르가못 디퓨저 200ml",
    description: "맑게 퍼지는 시트러스의 첫인상.",
    category: "fragrance",
    price: 28000,
    originalPrice: 36000,
    discountRate: 22,
    reviewCount: 412,
    rating: 4.7,
    badge: "신상",
    accentColor: "#d8a93a",
    glyph: "柑",
  },
  {
    id: "lt-pendant-lamp-09",
    brand: "OBJECT LAB",
    name: "오브제 펜던트 라이트 — 라떼",
    description: "다이닝 위에 놓이는 도자기 텍스처 펜던트.",
    category: "lighting",
    price: 159000,
    originalPrice: 199000,
    discountRate: 20,
    reviewCount: 254,
    rating: 4.6,
    badge: "EARLY ACCESS",
    freeShipping: true,
    accentColor: "#caa97e",
    glyph: "燈",
  },
  {
    id: "kc-wood-cutting-board-10",
    brand: "STILL HOUSE",
    name: "참나무 도마 — 라지",
    description: "오일 마감으로 매일 쓰기 좋은 참나무 도마.",
    category: "kitchen",
    price: 38000,
    originalPrice: 49000,
    discountRate: 22,
    reviewCount: 615,
    rating: 4.8,
    accentColor: "#7a4f2a",
    glyph: "板",
  },
  {
    id: "st-notebook-soft-11",
    brand: "STUDIO SLOW",
    name: "소프트 커버 노트북 — 에이지드 카키",
    description: "도톰한 80g 미색지에 만년필도 잘 받는 노트.",
    category: "stationery",
    price: 14000,
    originalPrice: 18000,
    discountRate: 22,
    reviewCount: 1248,
    rating: 4.9,
    badge: "베스트",
    accentColor: "#5a6238",
    glyph: "書",
    tags: ["리뷰 1000+"],
  },
  {
    id: "bd-pillow-down-12",
    brand: "FOLD HOME",
    name: "구스 다운 베개 — 미디엄",
    description: "통기성 좋은 90% 구스 다운, 90수 면 커버.",
    category: "bedding",
    price: 79000,
    originalPrice: 109000,
    discountRate: 28,
    reviewCount: 882,
    rating: 4.8,
    freeShipping: true,
    accentColor: "#b9b3a4",
    glyph: "枕",
  },
];

export const categories: { value: ProductCategory; label: string; icon: string }[] = [
  { value: "living", label: "리빙·인테리어", icon: "🪴" },
  { value: "lighting", label: "조명·무드등", icon: "💡" },
  { value: "kitchen", label: "키친·테이블웨어", icon: "🥣" },
  { value: "bedding", label: "패브릭·침구", icon: "🛏️" },
  { value: "fragrance", label: "향·캔들", icon: "🕯️" },
  { value: "stationery", label: "문구·소품", icon: "📓" },
];

export const categoryLabels: Record<ProductCategory, string> = Object.fromEntries(
  categories.map((c) => [c.value, c.label])
) as Record<ProductCategory, string>;

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export function formatPriceCompact(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
