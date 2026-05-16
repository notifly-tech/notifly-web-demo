"use client";

import { useState, type FormEvent } from "react";

import { createNewsletterSubscribedEvent } from "@/lib/events";
import { trackStorefrontEvent } from "@/lib/notifly-client";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setSubmitting(true);
    try {
      await trackStorefrontEvent(
        createNewsletterSubscribedEvent({ email: normalizedEmail, source: "footer" })
      );
    } catch {
      // SDK가 준비되지 않은 경우에도 구독 UX는 막지 않습니다.
    } finally {
      setSubmitting(false);
      setDone(true);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일 주소"
        aria-label="뉴스레터 구독 이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={done || submitting}
      />
      <button type="submit" disabled={done || submitting}>
        {done ? "구독 완료" : submitting ? "구독 중…" : "구독하기"}
      </button>
    </form>
  );
}
