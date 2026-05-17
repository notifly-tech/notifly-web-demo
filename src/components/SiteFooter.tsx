"use client";

import Link from "next/link";

import { handleDemoUnavailableClick } from "@/lib/demo-unavailable";

import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div>
          <p className="eyebrow">NEWSLETTER</p>
          <h3>매주 수요일, 노티프의 큐레이션 레터</h3>
          <p>새 입고, 단독 셀렉션, 매거진 소식을 가장 먼저 받아보세요.</p>
        </div>
        <NewsletterForm />
      </div>

      <div className="footer-inner">
        <div>
          <p className="footer-brand">NOTIF</p>
          <p className="footer-fineprint">
            주식회사 그레이박스 · 대표 이민용
            <br /> 서울 강남구 역삼로 172, 06248
            <br /> 사업자등록번호 830-81-02882
            <br /> 통신판매업신고 제2024-서울강남-0000호
            <br /> 호스팅서비스 (주)그레이박스
          </p>
          <p className="footer-fineprint">
            고객센터 <a href="tel:07041037622">070-4103-7622</a> · 평일 10:00–18:00 (주말·공휴일 휴무)
            <br /> <a href="mailto:contact@greyboxhq.com">contact@greyboxhq.com</a>
          </p>
        </div>
        <div>
          <h5>About</h5>
          <ul>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>회사 소개</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>입점 문의</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>매거진</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>채용</Link></li>
          </ul>
        </div>
        <div>
          <h5>Customer</h5>
          <ul>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>공지사항</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>자주 묻는 질문</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>1:1 문의</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>배송·교환·반품</Link></li>
          </ul>
        </div>
        <div>
          <h5>Policy</h5>
          <ul>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>이용약관</Link></li>
            <li>
              <Link href="#" style={{ fontWeight: 700 }} onClick={handleDemoUnavailableClick}>
                개인정보 처리방침
              </Link>
            </li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>마케팅 정보 수신동의</Link></li>
            <li><Link href="#" onClick={handleDemoUnavailableClick}>청소년 보호정책</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Greybox Inc. All rights reserved.</span>
        <div className="footer-badges">
          <span>KCP 안전결제</span>
          <span>구매안전 서비스 가입</span>
          <span>ISMS 인증</span>
        </div>
      </div>
    </footer>
  );
}
