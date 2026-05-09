import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useBoard } from '../hooks/useBoard';
import { useAuth } from '../hooks/useAuth';
import { boardCategories } from '../data/mockData';
import BoardList from '../components/board/BoardList';
import Button from '../components/common/Button';
import '../components/board/Board.css';

export default function BoardPage() {
  const { category } = useParams();
  const { posts, loadPosts, searchPosts } = useBoard();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryInfo = boardCategories.find((c) => c.id === category);

  useEffect(() => {
    if (category) loadPosts(category);
  }, [category, loadPosts]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      searchPosts(q, category);
    } else {
      loadPosts(category);
    }
  };

  return (
    <div className="board-page">
      <div className="board-page-header">
        <div>
          <div className="board-page-title">
            {categoryInfo && <span>{categoryInfo.name}</span>}
            <h1>{categoryInfo?.name || '게시판'}</h1>
          </div>
          {categoryInfo && <p className="board-page-desc">{categoryInfo.description}</p>}
        </div>
        <div className="board-search">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
            <input
              className="board-search-input"
              style={{ paddingLeft: '36px' }}
              placeholder="게시물 검색..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {user && (
            <Link to={`/create?category=${category}`}>
              <Button size="md"><Plus size={16} /> 글쓰기</Button>
            </Link>
          )}
        </div>
      </div>
      <BoardList posts={posts} />
    </div>
  );
}
