import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import './Board.css';

const TYPE_ICONS = {
  markdown: { icon: '📝', label: 'markdown' },
  file: { icon: '📎', label: 'file' },
  link: { icon: '🔗', label: 'link' },
};

/**
 * 게시물 카드 컴포넌트 (리스트 항목)
 */
export default function BoardCard({ post, index = 0 }) {
  const typeInfo = TYPE_ICONS[post.type] || TYPE_ICONS.markdown;

  return (
    <Link
      to={`/post/${post.id}`}
      className="board-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`board-card-type-icon ${typeInfo.label}`}>
        {typeInfo.icon}
      </div>

      <div className="board-card-body">
        <div className="board-card-title">{post.title}</div>
        <div className="board-card-meta">
          <span>{post.authorName}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.type === 'file' && post.fileName && (
            <>
              <span>·</span>
              <span>📎 {post.fileName}</span>
            </>
          )}
        </div>
      </div>

      <div className="board-card-stats">
        <span><Eye size={14} /> {post.views}</span>
        <span><Heart size={14} /> {post.likes}</span>
      </div>
    </Link>
  );
}
