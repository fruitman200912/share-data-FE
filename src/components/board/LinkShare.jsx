import { useState } from 'react';
import Button from '../common/Button';

export default function LinkShare({ onLinkSubmit, linkData }) {
  const [url, setUrl] = useState(linkData?.linkUrl || '');
  const [title, setTitle] = useState(linkData?.linkTitle || '');
  const [desc, setDesc] = useState(linkData?.linkDescription || '');

  const handleChange = (newUrl, newTitle, newDesc) => {
    onLinkSubmit?.({ linkUrl: newUrl, linkTitle: newTitle || newUrl, linkDescription: newDesc });
  };

  return (
    <div>
      <div className="create-post-field">
        <label>링크 URL</label>
        <div className="link-share-input-wrapper">
          <input className="link-share-input" type="url" placeholder="https://..." value={url} onChange={(e) => { setUrl(e.target.value); handleChange(e.target.value, title, desc); }} />
        </div>
      </div>
      {url && (
        <>
          <div className="create-post-field" style={{ marginTop: '16px' }}>
            <label>링크 제목</label>
            <input type="text" placeholder="링크 제목을 입력하세요" value={title} onChange={(e) => { setTitle(e.target.value); handleChange(url, e.target.value, desc); }} />
          </div>
          <div className="create-post-field" style={{ marginTop: '16px' }}>
            <label>링크 설명</label>
            <input type="text" placeholder="링크에 대한 설명을 입력하세요" value={desc} onChange={(e) => { setDesc(e.target.value); handleChange(url, title, e.target.value); }} />
          </div>
          {(title || url) && (
            <div className="link-share-preview">
              <div className="link-share-preview-title">{title || url}</div>
              {desc && <div className="link-share-preview-desc">{desc}</div>}
              <div className="link-share-preview-url">{url}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
