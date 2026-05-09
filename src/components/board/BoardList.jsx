import BoardCard from './BoardCard';
import { Inbox } from 'lucide-react';

/**
 * 게시물 목록 컴포넌트
 */
export default function BoardList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="board-list-empty">
        <div className="board-list-empty-icon"><Inbox size={48} /></div>
        <p>아직 게시물이 없습니다.</p>
        <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>첫 번째 글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="board-list">
      {posts.map((post, idx) => (
        <BoardCard key={post.id} post={post} index={idx} />
      ))}
    </div>
  );
}
