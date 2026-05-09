import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useBoard } from '../../hooks/useBoard';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import './Board.css';

export default function CommentSection({ post }) {
  const { user } = useAuth();
  const { addComment, deleteComment } = useBoard();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addComment(post.id, {
        authorId: user.id,
        authorName: user.name,
        content: content.trim()
      });
      setContent('');
    } catch (error) {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(post.id, commentId);
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const comments = post.comments || [];

  return (
    <div className="comment-section" style={{ marginTop: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: 'var(--font-size-lg)' }}>댓글 {comments.length}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
          disabled={!user || loading}
          style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={!user || !content.trim() || loading} loading={loading}>
            등록
          </Button>
        </div>
      </form>

      <div className="comment-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item" style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{comment.authorName}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                {formatDate(comment.createdAt, 'yyyy.MM.dd HH:mm')}
                {user?.id === comment.authorId && (
                  <button onClick={() => handleDelete(comment.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>삭제</button>
                )}
              </div>
            </div>
            <div style={{ color: 'var(--color-text-primary)' }}>{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
