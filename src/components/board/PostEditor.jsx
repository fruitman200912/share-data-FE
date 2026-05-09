import { useEffect, useRef } from 'react';

/**
 * 마크다운 에디터 컴포넌트
 * Toast UI Editor를 래핑합니다.
 * 에디터 라이브러리는 동적으로 임포트하여 번들 최적화합니다.
 */
export default function PostEditor({ initialValue = '', onChange, height = '400px' }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    let editor = null;

    const initEditor = async () => {
      const { default: Editor } = await import('@toast-ui/editor');
      await import('@toast-ui/editor/dist/toastui-editor.css');

      if (!editorRef.current) return;

      editor = new Editor({
        el: editorRef.current,
        height,
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        initialValue,
        placeholder: '마크다운으로 내용을 작성하세요...',
        theme: 'dark',
        events: {
          change: () => {
            const md = editor.getMarkdown();
            onChange?.(md);
          },
        },
      });

      editorInstanceRef.current = editor;
    };

    initEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="editor-wrapper">
      <div ref={editorRef} />
    </div>
  );
}
