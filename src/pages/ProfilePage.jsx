import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { boardService } from '../services/boardService';
import BoardCard from '../components/board/BoardCard';
import { Link } from 'react-router-dom';
import '../components/board/Board.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    boardService.getAllPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>로그인이 필요합니다.</h2>
        <Link to="/" style={{ color: 'var(--color-accent-primary)', marginTop: '16px', display: 'inline-block' }}>홈으로 가기</Link>
      </div>
    );
  }

  const myPosts = posts.filter(p => p.authorId === user.id);
  const likedPosts = posts.filter(p => p.likedUsers?.includes(user.id));
  const commentedPosts = posts.filter(p => p.comments?.some(c => c.authorId === user.id));

  const getActivePosts = () => {
    if (activeTab === 'posts') return myPosts;
    if (activeTab === 'likes') return likedPosts;
    if (activeTab === 'comments') return commentedPosts;
    return [];
  };

  const activePosts = getActivePosts();

  return (
    <div className="profile-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>내 프로필</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{user.name} ({user.email})</p>
        </div>
        <button 
          onClick={logout}
          style={{ padding: '8px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
        >
          로그아웃
        </button>
      </div>

      <div className="profile-stats" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{myPosts.length}</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px' }}>작성한 글</div>
        </div>
        <div style={{ flex: 1, padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{likedPosts.length}</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px' }}>좋아요 한 글</div>
        </div>
        <div style={{ flex: 1, padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{commentedPosts.length}</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px' }}>댓글 단 글</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'posts' ? '2px solid var(--color-accent-primary)' : '2px solid transparent', color: activeTab === 'posts' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)', fontWeight: activeTab === 'posts' ? 'bold' : 'normal' }}
        >
          작성한 글
        </button>
        <button 
          onClick={() => setActiveTab('likes')}
          style={{ padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'likes' ? '2px solid var(--color-accent-primary)' : '2px solid transparent', color: activeTab === 'likes' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)', fontWeight: activeTab === 'likes' ? 'bold' : 'normal' }}
        >
          좋아요 한 글
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          style={{ padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'comments' ? '2px solid var(--color-accent-primary)' : '2px solid transparent', color: activeTab === 'comments' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)', fontWeight: activeTab === 'comments' ? 'bold' : 'normal' }}
        >
          댓글 단 글
        </button>
      </div>

      <div className="board-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</div>
        ) : activePosts.length > 0 ? (
          activePosts.map((post) => (
            <BoardCard key={post.id} post={post} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>해당하는 게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
