import './Layout.css';

/**
 * 페이지 레이아웃 래퍼
 * Header 아래 콘텐츠 영역의 공통 레이아웃을 정의합니다.
 */
export default function Layout({ children, className = '' }) {
  return (
    <main className={`layout ${className}`}>
      <div className="layout-inner">{children}</div>
    </main>
  );
}
