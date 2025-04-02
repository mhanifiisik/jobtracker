import { type RefObject, useRef } from 'react';
import { MarkdownEditor } from './markdown';
import type { Document } from '@/types/db-tables';
import type { MDXEditorMethods } from '@mdxeditor/editor';

interface PDFViewerProps {
  document: Document;
  className?: string;
}

export function PDFViewer({ document, className = '' }: PDFViewerProps) {
  const markdownRef = useRef<MDXEditorMethods>(null);

  return (
    <div className={`h-full overflow-auto ${className}`}>
      <div className="prose dark:prose-invert max-w-none p-4">
        <MarkdownEditor
          markdownRef={markdownRef as RefObject<MDXEditorMethods>}
          content={document.content ?? ''}
          readonly={true}
          hideToolbar={true}
        />
      </div>
    </div>
  );
}
