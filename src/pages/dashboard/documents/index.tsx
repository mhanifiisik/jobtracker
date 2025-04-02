import { useCallback, useState, useMemo, useEffect } from 'react';
import { Search, Trash, LayoutGrid, Table as TableIcon, Plus, Save, Eye, Edit, Split, Monitor } from 'lucide-react';
import Table from '@/components/ui/table';
import { MDXEditorComponent } from '@/components/editor/mdx-editor';
import { useAuthStore } from '@/store/auth';
import { useDocumentsStore } from '@/store/documents';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Document } from '@/types/db-tables';

const ITEMS_PER_PAGE = 10;

type EditorView = 'edit' | 'preview' | 'split';

function DocumentsPage() {
  const { user } = useAuthStore();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [editorView, setEditorView] = useState<EditorView>('split');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Partial<Document>>({
    title: '',
    content: '',
    doc_type: 'markdown',
  });
  const { documents, isLoading, fetchDocuments, deleteDocument, createDocument, updateDocument } = useDocumentsStore();

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!id) {
        return;
      }
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    },
    [deleteDocument]
  );

  const handleSave = useCallback(
    async () => {
      try {
        if (currentDocument.id) {
          await updateDocument(currentDocument.id, {
            title: currentDocument.title,
            content: currentDocument.content,
            doc_type: 'markdown',
          });
        } else {
          await createDocument({
            title: currentDocument.title ?? '',
            content: currentDocument.content ?? '',
            user_id: user?.id ?? '',
            doc_type: 'markdown',
          });
        }
        setIsEditing(false);
        setCurrentDocument({
          title: '',
          content: '',
          doc_type: 'markdown',
        });
      } catch (error) {
        console.error('Failed to save document:', error);
      }
    },
    [currentDocument, createDocument, updateDocument, user?.id]
  );

  const handleEdit = useCallback((document: Document) => {
    setCurrentDocument({
      id: document.id,
      title: document.title,
      content: document.content,
      doc_type: document.doc_type,
    });
    setIsEditing(true);
  }, []);

  const handleNew = useCallback(() => {
    setCurrentDocument({
      title: '',
      content: '',
      doc_type: 'markdown',
    });
    setIsEditing(true);
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      return search.toLowerCase() === ''
        || doc.title.toLowerCase().includes(search.toLowerCase())
        || doc.content?.toLowerCase().includes(search.toLowerCase());
    });
  }, [documents, search]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setCurrentPage(p => {
      if (direction === 'prev') {
        return Math.max(1, p - 1);
      }
      return Math.min(totalPages, p + 1);
    });
  };

  const tableActions = (document: Document) => {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            handleEdit(document);
          }}
          className="text-muted-foreground hover:text-primary"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            void handleDelete(document.id);
          }}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderEditorContent = () => {
    if (!isEditing) return null;

    const editorContent = (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Document Title"
          value={currentDocument.title}
          onChange={(e) => {
            setCurrentDocument(prev => ({
              ...prev,
              title: e.target.value,
            }));
          }}
          className="w-full bg-transparent border border-border rounded-lg px-4 py-2"
        />
        <MDXEditorComponent
          content={currentDocument.content ?? ''}
          onChange={(content) => {
            setCurrentDocument(prev => ({
              ...prev,
              content,
            }));
          }}
          className="h-[calc(100vh-300px)]"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setCurrentDocument({
                title: '',
                content: '',
                doc_type: 'markdown',
              });
            }}
            className="px-4 py-2 rounded-lg border border-border"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    );

    const previewContent = (
      <div className="border border-border rounded-lg p-4 overflow-auto h-[calc(100vh-300px)]">
        <h2 className="text-xl font-bold mb-4">{currentDocument.title}</h2>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentDocument.content ?? ''}
          </ReactMarkdown>
        </div>
      </div>
    );

    switch (editorView) {
      case 'edit':
        return (
          <div className="w-full">
            {editorContent}
          </div>
        );
      case 'preview':
        return (
          <div className="w-full">
            {previewContent}
          </div>
        );
      case 'split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {editorContent}
            {previewContent}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <main className="mx-auto max-w-[100rem] px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-foreground text-2xl font-bold">Documents</h1>
        </div>
        {isLoading ? (
          <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground mb-4 text-lg">Loading documents...</p>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border border-border rounded-lg p-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                    className="bg-transparent px-4 py-2 rounded-lg border-none outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <div className="flex gap-2 mr-2 border border-border rounded-lg p-1">
                    <button
                      type="button"
                      className={`p-2 rounded-lg ${
                        editorView === 'edit' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
                      }`}
                      onClick={() => {
                        setEditorView('edit');
                      }}
                      title="Edit Mode"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg ${
                        editorView === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
                      }`}
                      onClick={() => {
                        setEditorView('preview');
                      }}
                      title="Preview Mode"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg ${
                        editorView === 'split' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
                      }`}
                      onClick={() => {
                        setEditorView('split');
                      }}
                      title="Split View"
                    >
                      <Split className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className={`p-2 rounded-lg border border-border ${
                    view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
                  }`}
                  onClick={() => {
                    setView('grid');
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('table');
                  }}
                  className={`p-2 rounded-lg border border-border ${
                    view === 'table' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNew}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Document
                </button>
              </div>
            </div>

            {renderEditorContent()}

            {!isEditing && (view === 'table' ? (
              <Table<Document>
                columns={['Title', 'Content', 'Last Updated']}
                data={filteredDocuments}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actions={tableActions}
                renderRow={(doc) => ({
                  Title: doc.title,
                  'Last Updated': doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A',
                })}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <div
                    key={doc.id}
                    className="group relative border border-border rounded-lg hover:border-primary transition-colors duration-200 flex flex-col"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold mb-1 line-clamp-1">{doc.title}</h2>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleEdit(doc);
                            }}
                            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            title="View/Edit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void handleDelete(doc.id);
                            }}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 overflow-hidden">
                      <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {doc.content ?? ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DocumentsPage;
