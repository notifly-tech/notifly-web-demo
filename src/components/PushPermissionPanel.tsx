"use client";

type PushPermissionPanelProps = {
  permission: NotificationPermission | "unsupported" | "unknown";
  onRequestPermission: () => Promise<void>;
  disabled: boolean;
};

const permissionLabel: Record<string, { label: string; tone: "neutral" | "granted" | "denied" }> = {
  default: { label: "미설정", tone: "neutral" },
  granted: { label: "허용됨", tone: "granted" },
  denied: { label: "차단됨", tone: "denied" },
  unsupported: { label: "지원 안 됨", tone: "denied" },
  unknown: { label: "확인 중", tone: "neutral" },
};

export function PushPermissionPanel({ permission, onRequestPermission, disabled }: PushPermissionPanelProps) {
  const meta = permissionLabel[permission] ?? permissionLabel.unknown;

  return (
    <section className="notify-row">
      <div>
        <h4>
          주문 · 배송 · 재입고 알림 받기
          <span className={`badge ${meta.tone === "granted" ? "granted" : meta.tone === "denied" ? "denied" : ""}`}>
            {meta.label}
          </span>
        </h4>
        <p>
          관심 상품이 다시 입고되거나 가격이 인하될 때 가장 먼저 알려드립니다. 언제든 마이페이지에서
          끌 수 있어요.
        </p>
      </div>
      <button
        type="button"
        className="accent"
        onClick={onRequestPermission}
        disabled={disabled || permission === "unsupported"}
      >
        알림 받기
      </button>
    </section>
  );
}
