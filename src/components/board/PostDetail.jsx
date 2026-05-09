import { formatDate } from '../../utils/dateUtils';
import { boardCategories } from '../../data/mockData';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Paperclip, Link2, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../../hooks/useBoard';
import { useState } from 'react';
import CommentSection from './CommentSection';

/**
 * 게시물 상세보기 컴포넌트
 * 게시물 타입(markdown/file/link)에 따라 다른 렌더링을 합니다.
 */
export default function PostDetail({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { deletePost, toggleLike } = useBoard();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!post) return null;

  const category = boardCategories.find((c) => c.id === post.category);

  // 링크 보완 함수
  const getValidUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://${url}`;
  };

  // 간단한 마크다운 → HTML 변환
  const renderMarkdown = (md) => {
    if (!md) return '';
    let html = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    // Wrap li tags
    html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');
    return `<p>${html}</p>`;
  };

  const isLiked = post.likedUsers?.includes(user?.id);

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        {category && (
          <div className="post-detail-category">{category.name}</div>
        )}
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{post.authorName}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt, 'yyyy.MM.dd HH:mm')}</span>
          <span>·</span>
          <span>조회 {post.views}</span>
          <span>·</span>
          <button 
            onClick={() => {
              if (!user) return alert('로그인이 필요합니다.');
              toggleLike(post.id, user.id);
            }}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '4px', 
              color: isLiked ? 'var(--color-danger)' : 'var(--color-text-tertiary)',
              padding: 0
            }}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            {post.likes || 0}
          </button>
        </div>
        {user?.id === post.authorId && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <Button size="sm" variant="secondary" onClick={() => navigate(`/edit/${post.id}?category=${post.category}`)}>수정</Button>
            <Button size="sm" variant="secondary" onClick={() => setIsDeleteModalOpen(true)}>삭제</Button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시물 삭제"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button onClick={async () => {
              await deletePost(post.id);
              setIsDeleteModalOpen(false);
              navigate(`/board/${post.category}`);
            }}>삭제</Button>
          </div>
        }
      >
        <p>정말 이 게시물을 삭제하시겠습니까?</p>
      </Modal>

      {post.type === 'markdown' && (
        <div
          className="post-detail-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      )}

      {post.type === 'file' && (
        <div className="post-detail-file">
          <div className="post-detail-file-icon"><Paperclip size={32} /></div>
          <div className="post-detail-file-info">
            <h3>{post.fileName}</h3>
            <p>{post.fileSize}</p>
          </div>
          <Button variant="secondary" size="sm">다운로드</Button>
        </div>
      )}

      {post.type === 'link' && (
        <a
          href={getValidUrl(post.linkUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="post-detail-link"
        >
          <div className="post-detail-link-title"><Link2 size={16} /> {post.linkTitle || post.linkUrl}</div>
          {post.linkDescription && (
            <div className="post-detail-link-desc">{post.linkDescription}</div>
          )}
          <div className="post-detail-link-url">{post.linkUrl}</div>
        </a>
      )}

      <CommentSection post={post} />
    </div>
  );
}
