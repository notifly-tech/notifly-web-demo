"use client";

import { FormEvent, useState } from "react";

import type { LifecycleStage, MembershipTier, UserProfileInput } from "@/lib/events";
import type { ProductCategory } from "@/lib/products";

type UserProfileForm = UserProfileInput & {
  userId: string;
  email: string;
};

type UserProfilePanelProps = {
  onSave: (profile: UserProfileForm) => Promise<void>;
  disabled: boolean;
};

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "living", label: "리빙·인테리어" },
  { value: "lighting", label: "조명·무드등" },
  { value: "kitchen", label: "키친·테이블웨어" },
  { value: "bedding", label: "패브릭·침구" },
  { value: "fragrance", label: "향·캔들" },
  { value: "stationery", label: "문구·소품" },
];

const membershipOptions: { value: MembershipTier; label: string }[] = [
  { value: "free", label: "일반 회원" },
  { value: "premium", label: "NOTIF+ 멤버십" },
];

export function UserProfilePanel({ onSave, disabled }: UserProfilePanelProps) {
  const [userId, setUserId] = useState("notif_2024_8421");
  const [email, setEmail] = useState("hello@notif.shop");
  const [membershipTier, setMembershipTier] = useState<MembershipTier>("premium");
  const [favoriteCategory, setFavoriteCategory] = useState<ProductCategory>("living");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const lifecycleStage: LifecycleStage = "returning_user";
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({
        userId,
        email,
        membershipTier,
        favoriteCategory,
        marketingOptIn,
        lifecycleStage,
      });
      setSavedAt(
        new Intl.DateTimeFormat("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profile-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">My NOTIF</p>
          <h2>내 정보 · 맞춤 추천 설정</h2>
        </div>
        <p className="sub">
          관심사에 맞춰 가격 인하·재입고 알림을
          <br />
          더 정확하게 보내드립니다.
        </p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          회원 ID
          <input value={userId} onChange={(event) => setUserId(event.target.value)} required />
        </label>
        <label>
          이메일
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          멤버십 등급
          <select value={membershipTier} onChange={(event) => setMembershipTier(event.target.value as MembershipTier)}>
            {membershipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          관심 카테고리
          <select value={favoriteCategory} onChange={(event) => setFavoriteCategory(event.target.value as ProductCategory)}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-label full">
          <input
            checked={marketingOptIn}
            type="checkbox"
            onChange={(event) => setMarketingOptIn(event.target.checked)}
          />
          마케팅 정보 수신에 동의합니다 (특가 · 신상 · 단독 입고 알림)
        </label>
        <div className="full profile-actions">
          <span className="hint">
            {savedAt ? `${savedAt} · 저장 완료` : "변경 사항은 즉시 추천 알고리즘에 반영됩니다."}
          </span>
          <button type="submit" disabled={disabled || saving}>
            {saving ? "저장 중…" : "변경 저장"}
          </button>
        </div>
      </form>
    </section>
  );
}
