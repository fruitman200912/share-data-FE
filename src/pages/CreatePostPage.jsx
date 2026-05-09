import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Link2 } from 'lucide-react';
import { useBoard } from '../hooks/useBoard';
import { boardService } from '../services/boardService';
import { useAuth } from '../hooks/useAuth';
import { boardCategories } from '../data/mockData';
import PostEditor from '../components/board/PostEditor';
import FileUpload from '../components/board/FileUpload';
import LinkShare from '../components/board/LinkShare';
import Button from '../components/common/Button';
import '../components/board/Board.css';

const POST_TYPES = [
  { id: 'markdown', label: '마크다운 에디터', icon: FileText },
  { id: 'file', label: '파일 업로드', icon: Upload },
  { id: 'link', label: '링크 공유', icon: Link2 },
];

export default function CreatePostPage() {
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'free';
  const { createPost, updatePost } = useBoard();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [postType, setPostType] = useState('markdown');
  const [markdownContent, setMarkdownContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit Mode: Fetch post data
  useEffect(() => {
    if (isEditMode) {
      boardService.getPostById(id).then((post) => {
        if (post.authorId !== user?.id) {
          alert('수정 권한이 없습니다.');
          navigate(-1);
          return;
        }
        setTitle(post.title);
        setCategory(post.category);
        setPostType(post.type);
        if (post.type === 'markdown') setMarkdownContent(post.content);
        if (post.type === 'file') setSelectedFile({ name: post.fileName, size: 0 }); // mock file object
        if (post.type === 'link') setLinkData({ linkUrl: post.linkUrl, linkTitle: post.linkTitle, linkDescription: post.linkDescription });
      }).catch(() => {
        alert('게시물을 불러오지 못했습니다.');
        navigate('/');
      });
    }
  }, [id, isEditMode, user, navigate]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>로그인이 필요합니다.</p>
        <Link to="/"><Button variant="secondary">홈으로</Button></Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      const postData = {
        title, category, type: postType,
        authorId: user.id, authorName: user.name,
        content: postType === 'markdown' ? markdownContent : '',
      };
      if (postType === 'file' && selectedFile) {
        postData.fileName = selectedFile.name;
        postData.fileSize = `${(selectedFile.size / 1048576).toFixed(1)}MB`;
      }
      if (postType === 'link' && linkData) {
        Object.assign(postData, linkData);
      }
      if (isEditMode) {
        await updatePost(id, postData);
        navigate(`/post/${id}`);
      } else {
        await createPost(postData);
        navigate(`/board/${category}`);
      }
    } catch (err) {
      alert('게시물 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <Link to={`/board/${category}`} className="back-link">
        <ArrowLeft size={16} /> 목록으로
      </Link>
      <h1>{isEditMode ? '게시물 수정' : '새 게시물 작성'}</h1>
      <div className="create-post-form">
        <div className="create-post-field">
          <label>게시판</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {boardCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="create-post-field">
          <label>제목</label>
          <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="create-post-field">
          <label>작성 방식</label>
          <div className="post-type-tabs">
            {POST_TYPES.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`post-type-tab${postType === id ? ' active' : ''}`} onClick={() => setPostType(id)}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>
        <div className="create-post-field">
          {postType === 'markdown' && <PostEditor initialValue={markdownContent} onChange={setMarkdownContent} />}
          {postType === 'file' && <FileUpload selectedFile={selectedFile} onFileSelect={setSelectedFile} onRemove={() => setSelectedFile(null)} />}
          {postType === 'link' && <LinkShare linkData={linkData} onLinkSubmit={setLinkData} />}
        </div>
        <div className="create-post-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
          <Button loading={loading} onClick={handleSubmit}>{isEditMode ? '수정 완료' : '게시하기'}</Button>
        </div>
      </div>
    </div>
  );
}
