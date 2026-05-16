# Notifly Web Demo

Notifly JavaScript SDK를 실제 서비스처럼 체험해볼 수 있는 Next.js 샘플 프로젝트입니다.

이 프로젝트는 **NOTIF**라는 가상의 라이프스타일 쇼핑몰입니다. 방문자는 상품을 보고, 장바구니에 담고, 주문서를 작성하고, 결제 완료 화면까지 이동할 수 있습니다. 이 과정에서 Notifly 이벤트가 전송되고, Notifly 콘솔에서 웹 팝업과 웹 푸시 캠페인을 테스트할 수 있습니다.

> 실제 결제나 배송은 일어나지 않습니다. Notifly 연동을 시험하기 위한 가상 쇼핑몰입니다.

## 무엇을 테스트할 수 있나요?

- 웹사이트 방문 이벤트 수집
- 상품 조회, 장바구니, 체크아웃, 구매 완료 이벤트 수집
- 마이페이지에서 사용자 정보와 관심사 저장
- 웹 팝업 캠페인 노출 테스트
- 웹 푸시 권한 요청과 푸시 캠페인 테스트
- 화면 오른쪽 아래 패널에서 SDK 연결 상태 확인

## 데모 서비스 구성

| 화면 | 사용자가 하는 일 | Notifly에서 확인할 수 있는 것 |
| --- | --- | --- |
| 홈 | 상품 둘러보기, 상품 카드에 마우스 올리기 | 페이지 방문, 상품 조회 |
| 장바구니 | 상품 수량 변경, 쿠폰 적용, 결제 이동 | 장바구니 담기, 장바구니 금액 |
| 체크아웃 | 배송지 확인, 결제 동의, 결제하기 | 결제 시작, 구매 완료 |
| 주문 완료 | 주문 결과 확인 | 구매 완료 후 캠페인 테스트 |
| 마이페이지 | 사용자 정보 저장, 푸시 권한 요청 | 사용자 속성 저장, 푸시 권한 요청 |
| 푸터 | 뉴스레터 구독 | 뉴스레터 구독 이벤트 |

## 준비물

1. Node.js와 npm이 설치된 PC
2. Notifly 프로젝트
3. Notifly JavaScript SDK 설정값
   - `project id`
   - `username`

프로젝트 비밀번호는 입력하지 않습니다.

## 실행 방법

```bash
git clone https://github.com/notifly-tech/notifly-web-demo.git
cd notifly-web-demo
npm install
cp .env.example .env.local
```

`.env.local` 파일을 열고 Notifly 프로젝트 정보를 입력합니다.

```bash
NEXT_PUBLIC_NOTIFLY_PROJECT_ID=0123456789abcdef0123456789abcdef
NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME=your-project-username
NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT=false
```

그 다음 앱을 실행합니다.

```bash
npm run dev:https
```

브라우저에서 아래 주소로 접속합니다.

```txt
https://localhost:3000
```

처음 실행하면 브라우저가 로컬 인증서 경고를 보여줄 수 있습니다. 로컬 테스트용으로 예외를 허용하면 됩니다.

웹 팝업과 이벤트 수집만 빠르게 확인하려면 아래 명령도 사용할 수 있습니다.

```bash
npm run dev
```

다만 웹 푸시는 브라우저 보안 정책 때문에 HTTPS 환경에서 테스트하는 편이 좋습니다.

## Notifly 콘솔에서 설정할 것

### 1. 웹 푸시

Notifly 콘솔에서 해당 프로젝트의 웹사이트 SDK 설정으로 이동한 뒤 웹 푸시를 켭니다.

Service Worker 경로는 아래처럼 설정합니다.

```txt
/notifly-service-worker.js
```

이 프로젝트에는 이미 같은 경로로 동작하는 파일이 들어 있습니다.

```txt
public/notifly-service-worker.js
```

콘솔에 입력한 경로와 실제 파일 경로가 다르면 웹 푸시가 동작하지 않을 수 있습니다.

### 2. 웹 팝업

Notifly 콘솔에서 웹 팝업 캠페인을 만들고, 아래 이벤트 중 하나를 트리거로 사용하면 됩니다.

| 캠페인 예시 | 사용자가 앱에서 할 일 | 이벤트 이름 |
| --- | --- | --- |
| 첫 방문 환영 메시지 | 홈 접속 | `page_viewed` |
| 장바구니 쿠폰 안내 | 상품을 장바구니에 담기 | `product_added_to_cart` |
| 결제 전환 유도 | 장바구니에서 결제 화면으로 이동 | `checkout_started` |
| 구매 감사 메시지 | 결제 완료 | `purchase_completed` |
| 뉴스레터 구독 완료 안내 | 푸터에서 이메일 구독 | `newsletter_subscribed` |

테스트 캠페인을 특정 사용자에게만 보여주고 싶다면, 앱의 마이페이지에서 사용하는 사용자 ID를 Notifly 콘솔의 테스트 대상에 추가하세요.

## 추천 테스트 순서

1. 앱을 실행하고 `https://localhost:3000`에 접속합니다.
2. 오른쪽 아래 `SDK` 패널을 열어 상태가 `온라인`인지 확인합니다.
3. 홈에서 상품을 둘러보고 `장바구니 담기`를 누릅니다.
4. 장바구니로 이동해 결제 화면으로 갑니다.
5. 주문서에서 약관 동의 후 `결제하기`를 누릅니다.
6. Notifly 콘솔에서 이벤트가 들어왔는지 확인합니다.
7. 웹 팝업 캠페인을 켜고 같은 행동을 반복해 팝업 노출을 확인합니다.
8. 마이페이지에서 `푸시 권한 요청`을 눌러 웹 푸시 권한을 허용합니다.
9. Notifly 콘솔에서 웹 푸시 캠페인을 보내봅니다.

## 전송되는 주요 이벤트

| 이벤트 이름 | 의미 |
| --- | --- |
| `page_viewed` | 페이지 방문 |
| `product_viewed` | 상품 조회 |
| `product_added_to_cart` | 장바구니 담기 |
| `checkout_started` | 결제 시작 |
| `purchase_completed` | 구매 완료 |
| `newsletter_subscribed` | 뉴스레터 구독 |
| `user_profile_updated` | 사용자 정보 저장 |
| `notification_permission_cta_clicked` | 푸시 권한 요청 버튼 클릭 |

## 사용자 정보 테스트

마이페이지에서 아래 정보를 바꿔볼 수 있습니다.

- 사용자 ID
- 이메일
- 멤버십 등급
- 관심 카테고리
- 마케팅 수신 여부
- 신규/재방문 사용자 구분

이 정보는 웹 팝업이나 웹 푸시 캠페인의 타겟 조건을 테스트할 때 사용할 수 있습니다.

## 자주 막히는 부분

| 증상 | 확인할 것 |
| --- | --- |
| SDK 패널이 `테스트 모드`로 보임 | `.env.local`에 `project id`, `username`이 들어갔는지 확인 |
| SDK가 연결되지 않음 | `project id`가 32자리 형식인지 확인 |
| 웹 팝업이 안 보임 | 캠페인이 활성화되어 있는지, 이벤트 조건이 맞는지 확인 |
| 웹 푸시 권한 요청이 안 보임 | `https://localhost:3000`에서 실행 중인지 확인 |
| 푸시가 계속 안 옴 | 브라우저 알림 권한이 차단되어 있지 않은지 확인 |
| Service Worker 오류가 남 | 콘솔의 Service Worker path가 `/notifly-service-worker.js`인지 확인 |

## 배포해서 테스트하기

Vercel 같은 HTTPS 배포 환경에 올리면 웹 푸시를 더 실제 환경에 가깝게 테스트할 수 있습니다.

배포 환경에서도 필요한 값은 동일합니다.

```bash
NEXT_PUBLIC_NOTIFLY_PROJECT_ID=...
NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME=...
NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT=false
```

## 개발자가 확인할 때

```bash
npm run lint
npm test
npm run build
```

이 명령들은 문법, 테스트, production build가 정상인지 확인합니다.
