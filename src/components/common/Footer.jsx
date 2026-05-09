import { Share2, Globe, MessageCircle, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Share2 size={24} />
            <span>ShareData</span>
          </div>
          <p>지식과 자료를 나누는 공간</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-link-group">
            <h4>서비스</h4>
            <a href="#">공지사항</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </div>
          <div className="footer-link-group">
            <h4>고객지원</h4>
            <a href="#">FAQ</a>
            <a href="#">문의하기</a>
          </div>
          <div className="footer-link-group">
            <h4>소셜</h4>
            <div className="footer-socials">
              <a href="#" aria-label="Website"><Globe size={20} /></a>
              <a href="#" aria-label="Community"><MessageCircle size={20} /></a>
              <a href="#" aria-label="Mail"><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShareData. All rights reserved.</p>
      </div>
    </footer>
  );
}
