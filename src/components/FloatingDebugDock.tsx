"use client";

import { useEffect, useState } from "react";
import { useNotiflyStatus } from "./NotiflyProvider";

type RuntimeSecurity = {
  origin: string;
  protocol: string;
  status: "checking" | "secure" | "insecure";
};

const labels: Record<string, { text: string; tone: "ok" | "warn" | "err" }> = {
  ready: { text: "온라인", tone: "ok" },
  initializing: { text: "연결 중", tone: "warn" },
  idle: { text: "대기", tone: "warn" },
  failed: { text: "점검 중", tone: "err" },
  missing_config: { text: "테스트 모드", tone: "warn" },
};

function useRuntimeSecurity(): RuntimeSecurity {
  const [s, setS] = useState<RuntimeSecurity>({ origin: "확인 중", protocol: "확인 중", status: "checking" });
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setS({
      origin: window.location.origin,
      protocol: window.location.protocol.replace(":", ""),
      status: window.isSecureContext ? "secure" : "insecure",
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  return s;
}

export function FloatingDebugDock() {
  const status = useNotiflyStatus();
  const security = useRuntimeSecurity();
  const [open, setOpen] = useState(false);

  const meta = labels[status.status] ?? { text: status.status, tone: "warn" as const };

  return (
    <div className={`debug-dock ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="debug-dock-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="개발자 패널 열기"
      >
        <span className={`dot ${meta.tone}`} />
        SDK · {meta.text}
      </button>
      {open && (
        <div className="debug-dock-body">
          <div className="row">
            <span>SDK 상태</span>
            <strong className={meta.tone}>{meta.text}</strong>
          </div>
          <div className="row">
            <span>메시지</span>
            <strong>{status.message}</strong>
          </div>
          <div className="row">
            <span>Origin</span>
            <code>{security.origin}</code>
          </div>
          <div className="row">
            <span>Protocol</span>
            <code>{security.protocol}</code>
          </div>
          <div className="row">
            <span>Secure context</span>
            <strong className={security.status === "secure" ? "ok" : "err"}>
              {security.status}
            </strong>
          </div>
          {(status.missingFields.length > 0 || status.invalidFields.length > 0) && (
            <div className="dock-warn">
              <strong>환경 변수 점검</strong>
              <ul>
                {status.missingFields.map((f) => (
                  <li key={f}>
                    누락 <code>{f}</code>
                  </li>
                ))}
                {status.invalidFields.map((f) => (
                  <li key={f}>
                    형식 오류 <code>{f}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="dock-hint">
            SDK 상태와 웹 푸시 보안 컨텍스트를 빠르게 확인할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
