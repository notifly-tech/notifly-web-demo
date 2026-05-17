export const DEMO_UNAVAILABLE_MESSAGE =
  "데모에서는 제공되지 않는 기능입니다. 장바구니 담기, 알림 받기, 뉴스레터 구독, 결제 완료 흐름을 사용해 보세요.";

export function showDemoUnavailable() {
  window.alert(DEMO_UNAVAILABLE_MESSAGE);
}

export function handleDemoUnavailableClick(event: { preventDefault: () => void }) {
  event.preventDefault();
  showDemoUnavailable();
}
