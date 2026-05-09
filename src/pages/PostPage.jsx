import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBoard } from '../hooks/useBoard';
import PostDetail from '../components/board/PostDetail';
import '../components/board/Board.css';

export default function PostPage() {
  const { id } = useParams();
  const { currentPost, loadPost, isLoading } = useBoard();

  useEffect(() => {
    if (id) loadPost(id);
  }, [id, loadPost]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-tertiary)' }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link
        to={currentPost ? `/board/${currentPost.category}` : '/'}
        className="back-link"
      >
        <ArrowLeft size={16} /> 목록으로
      </Link>
      <PostDetail post={currentPost} />
    </div>
  );
}
