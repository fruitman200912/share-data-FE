import { useState, useRef } from 'react';
import { X, FolderUp, FileText, File } from 'lucide-react';

export default function FileUpload({ onFileSelect, selectedFile, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'md', 'markdown'].includes(ext)) {
      alert('PDF 또는 마크다운(.md) 파일만 업로드할 수 있습니다.');
      return;
    }
    onFileSelect?.(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <div
        className={`file-upload-zone${isDragging ? ' dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="file-upload-zone-icon"><FolderUp size={32} /></div>
        <div className="file-upload-zone-text">파일을 드래그하거나 클릭하여 업로드하세요</div>
        <div className="file-upload-zone-hint">PDF, Markdown (.md) 파일 지원</div>
        <input ref={inputRef} type="file" accept=".pdf,.md,.markdown" onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} style={{ display: 'none' }} />
      </div>
      {selectedFile && (
        <div className="file-upload-preview">
          <div className="file-upload-preview-icon">{selectedFile.name.endsWith('.pdf') ? <File size={24} /> : <FileText size={24} />}</div>
          <div className="file-upload-preview-info">
            <div className="file-upload-preview-name">{selectedFile.name}</div>
            <div className="file-upload-preview-size">{formatSize(selectedFile.size)}</div>
          </div>
          <button className="file-upload-remove" onClick={onRemove} aria-label="파일 제거"><X size={18} /></button>
        </div>
      )}
    </div>
  );
}
