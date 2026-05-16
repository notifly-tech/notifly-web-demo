"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { initializeNotifly } from "@/lib/notifly-client";

type SdkStatus = "idle" | "initializing" | "ready" | "missing_config" | "failed";

type NotiflyContextValue = {
  status: SdkStatus;
  message: string;
  missingFields: string[];
  invalidFields: string[];
};

const initialContextValue: NotiflyContextValue = {
  status: "initializing",
  message: "Notifly SDK를 초기화하는 중입니다.",
  missingFields: [],
  invalidFields: [],
};

const NotiflyContext = createContext<NotiflyContextValue>(initialContextValue);

export function NotiflyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<NotiflyContextValue>(initialContextValue);

  useEffect(() => {
    let active = true;

    initializeNotifly().then((result) => {
      if (!active) return;

      if (result.ready) {
        setValue({
          status: "ready",
          message: "Notifly SDK가 준비되었습니다.",
          missingFields: [],
          invalidFields: [],
        });
        return;
      }

      if (result.reason === "missing_config") {
        setValue({
          status: "missing_config",
          message: "필수 환경 변수를 확인해 주세요.",
          missingFields: result.config.missingFields,
          invalidFields: result.config.invalidFields,
        });
        return;
      }

      setValue({
        status: "failed",
        message: result.message,
        missingFields: [],
        invalidFields: [],
      });
    });

    return () => {
      active = false;
    };
  }, []);

  const contextValue = useMemo(() => value, [value]);

  return <NotiflyContext.Provider value={contextValue}>{children}</NotiflyContext.Provider>;
}

export function useNotiflyStatus() {
  return useContext(NotiflyContext);
}
