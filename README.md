# Notifly Web Demo

Notifly JavaScript SDK로 웹 푸시, 웹 팝업, 이벤트 연동을 빠르게 테스트해볼 수 있는 Next.js 샘플 프로젝트입니다.

앱은 작은 커머스 서비스인 **BloomCart**로 구성되어 있습니다. 사용자는 상품을 조회하고, 장바구니에 담고, 결제를 시작하고, 구매 완료까지 실행해볼 수 있습니다. 각 행동은 Notifly 이벤트로 전송되며, Notifly 콘솔에서 이 이벤트를 기반으로 웹 팝업과 웹 푸시 캠페인을 테스트할 수 있습니다.

## 할 수 있는 것

- Notifly JavaScript SDK 초기화
- 유저 식별과 유저 속성 설정
- 상품 조회, 장바구니, 결제 이벤트 전송
- 웹 팝업 캠페인 트리거 테스트
- 웹 푸시 권한 요청과 Service Worker 연동 확인
- 이벤트 전송 상태를 화면에서 확인

## 빠른 시작

```bash
git clone https://github.com/notifly-tech/notifly-web-demo.git
cd notifly-web-demo
npm install
cp .env.example .env.local
npm run dev:https
```

브라우저에서 아래 주소로 접속합니다.

```txt
https://localhost:3000
```

Next.js가 로컬 개발용 self-signed 인증서를 생성합니다. 브라우저에서 인증서 경고가 보이면 로컬 테스트용으로 예외를 허용한 뒤 접속합니다.

웹 팝업과 이벤트 수집만 빠르게 확인할 때는 `npm run dev`로 `http://localhost:3000`을 사용할 수 있습니다. 웹 푸시까지 테스트하려면 HTTPS 실행을 권장합니다.

## 환경 변수 설정

`.env.local`에 Notifly 프로젝트의 JavaScript SDK 연동 정보를 입력합니다.

```bash
NEXT_PUBLIC_NOTIFLY_PROJECT_ID=32자리_project_id
NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME=project_username
NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT=false
```

`NEXT_PUBLIC_` 값은 브라우저 번들에 포함됩니다. 이 데모에서는 프로젝트 비밀번호를 입력하지 않습니다. `notifly-js-sdk@2.18.0`은 아직 초기화 옵션의 `password` 값이 비어 있으면 실패하므로, 앱 내부에서 공개 placeholder인 `not-used`만 넘깁니다. 실제 프로젝트 비밀번호나 콘솔 로그인 비밀번호를 `.env.local`에 넣지 마세요.

## 로컬 HTTPS 실행

웹 푸시와 Service Worker는 브라우저의 보안 컨텍스트에서 동작합니다. 즉 실제 테스트는 HTTPS에서 하는 편이 안전합니다. 이 프로젝트는 Next.js의 local HTTPS 옵션을 스크립트로 제공합니다.

```bash
npm run dev:https
```

기본 주소는 아래와 같습니다.

```txt
https://localhost:3000
```

다른 포트를 쓰려면 Next.js dev server 옵션을 그대로 넘깁니다.

```bash
npm run dev:https -- -p 3443
```

처음 실행하면 Next.js가 self-signed 인증서를 만들 수 있습니다. 생성된 로컬 인증서는 `certificates/`에 저장될 수 있으며, 저장소에는 포함하지 않습니다.

로컬 HTTPS로 실행한 뒤 앱 오른쪽의 “연동 상태” 카드에서 `Protocol`이 `https`, `보안 컨텍스트`가 `secure`인지 확인하세요.

## Notifly 콘솔 설정

### 웹 푸시

1. Notifly 콘솔에서 해당 프로젝트로 이동합니다.
2. 설정 → SDK 설정 → 웹사이트 설정으로 이동합니다.
3. 웹 푸시 사용을 켭니다.
4. VAPID 키를 생성합니다.
5. Service Worker path를 아래 값으로 설정합니다.

```txt
/notifly-service-worker.js
```

이 프로젝트에는 아래 파일이 포함되어 있습니다.

```txt
public/notifly-service-worker.js
```

브라우저에서 실제 접근되는 경로는 `/notifly-service-worker.js`입니다. 콘솔의 Service Worker path와 이 경로가 반드시 같아야 합니다.

권한 요청 방식은 콘솔 설정에 따라 달라집니다.

- 자동 노출 ON: SDK 초기화 후 콘솔에서 설정한 조건에 따라 권한 안내 팝업이 표시됩니다.
- 자동 노출 OFF: 앱 화면의 “푸시 권한 요청” 버튼으로 권한 요청을 테스트합니다.

### 웹 팝업

Notifly 콘솔에서 웹 팝업 캠페인을 만들고, 트리거 이벤트를 아래처럼 설정하면 앱에서 바로 테스트할 수 있습니다.

| 목적 | 트리거 이벤트 | 추천 조건 |
| --- | --- | --- |
| 장바구니 쿠폰 노출 | `product_added_to_cart` | `cart_value >= 30000` |
| 결제 전환 유도 | `checkout_started` | 1~3초 지연 후 노출 |
| 구매 완료 안내 | `purchase_completed` | `revenue >= 1` |

테스트 캠페인으로 운영하는 경우, 앱 화면에서 사용하는 `User ID` 값을 캠페인 테스트 대상 또는 whitelist에 추가하세요.

## 앱에서 테스트하는 순서

1. `.env.local`에 프로젝트 정보를 입력하고 `npm run dev:https`로 앱을 실행합니다.
2. 오른쪽 “연동 상태” 카드에서 SDK 상태가 `ready`인지 확인합니다.
3. “유저 속성 저장” 버튼을 눌러 유저 ID와 속성을 설정합니다.
4. 상품 카드에서 “조회 이벤트” 또는 “장바구니 담기”를 클릭합니다.
5. “결제 시작” 또는 “구매 완료”를 클릭합니다.
6. “이벤트 타임라인”에서 전송된 이벤트 이름과 payload를 확인합니다.
7. Notifly 콘솔에서 이벤트 수집 여부와 웹 팝업 노출 여부를 확인합니다.
8. 웹 푸시를 테스트하려면 “푸시 권한 요청” 버튼을 누르고 브라우저 권한을 허용합니다.

## 전송되는 이벤트

| 사용자 행동 | eventName | 주요 eventParams |
| --- | --- | --- |
| 페이지 진입 | `page_viewed` | `page` |
| 유저 속성 저장 | `user_profile_updated` | `membership_tier`, `favorite_category`, `marketing_opt_in`, `lifecycle_stage` |
| 상품 조회 | `product_viewed` | `product_id`, `product_name`, `category`, `price`, `currency` |
| 장바구니 담기 | `product_added_to_cart` | `product_id`, `quantity`, `cart_value`, `currency` |
| 결제 시작 | `checkout_started` | `cart_value`, `item_count`, `currency` |
| 구매 완료 | `purchase_completed` | `order_id`, `revenue`, `item_count`, `currency` |
| 푸시 권한 CTA 클릭 | `notification_permission_cta_clicked` | `source` |

## 설정되는 유저 속성

| key | 예시 | 설명 |
| --- | --- | --- |
| `membership_tier` | `free`, `premium` | 멤버십 등급 |
| `favorite_category` | `plant`, `desk`, `coffee` | 관심 카테고리 |
| `marketing_opt_in` | `true` | 마케팅 수신 여부 |
| `lifecycle_stage` | `new_user`, `returning_user` | 유저 단계 |
| `$email` | `customer@example.com` | 이메일 속성 |

## 브라우저에서 확인하기

DevTools의 Network 탭에서 아래 요청을 확인할 수 있습니다.

```txt
POST https://api.notifly.tech/authorize
GET  https://api.notifly.tech/sdk-configurations?project_id=...&type=website
GET  https://api.notifly.tech/user-state/...
POST https://e.notifly.tech/records
```

Application 탭에서는 아래 항목을 확인할 수 있습니다.

```txt
Service Worker: /notifly-service-worker.js
IndexedDB: notifly / notiflyconfig
```

## 테스트 명령

```bash
npm test
npm run lint
npm run build
```

## 문제 해결

| 증상 | 확인할 것 |
| --- | --- |
| SDK 상태가 `missing_config`로 표시됨 | `.env.local`에 필수 환경 변수가 있는지 확인 |
| SDK 초기화 실패 | `NEXT_PUBLIC_NOTIFLY_PROJECT_ID`가 32자리 hex 형식인지 확인 |
| 웹 푸시 권한 팝업이 안 보임 | `https://localhost:3000`에서 실행 중인지, 이미 허용/차단된 브라우저 권한인지 확인 |
| 수동 권한 요청이 무시됨 | 콘솔에서 권한 요청 자동 노출이 켜져 있는지 확인 |
| Service Worker 404 | `public/notifly-service-worker.js` 파일과 콘솔 path가 일치하는지 확인 |
| `보안 컨텍스트`가 `insecure`로 표시됨 | `npm run dev:https`로 다시 실행하거나 HTTPS 배포 환경에서 테스트 |
| 웹 팝업이 안 뜸 | 이벤트 이름, 캠페인 조건, 테스트 대상 설정을 확인 |
| 이벤트는 들어오지만 팝업 없음 | `user-state` 응답에 웹 팝업 캠페인이 포함되는지 확인 |

## 배포해서 테스트하기

Vercel 같은 HTTPS 환경에 배포하면 실제 브라우저 푸시 정책에 더 가깝게 테스트할 수 있습니다. 로컬에서는 `npm run dev:https`로 HTTPS 개발 서버를 띄워 테스트하세요. 단순 이벤트/웹 팝업 확인만 필요하면 브라우저의 `localhost` 예외로도 동작할 수 있지만, 웹 푸시 검증은 HTTPS 기준으로 보는 편이 덜 헷갈립니다.
