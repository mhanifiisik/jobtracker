import { useCallback, useState, useMemo, useEffect } from 'react';
import { Search, Trash, LayoutGrid, Table as TableIcon, Plus, Save, Upload,Eye } from 'lucide-react';
import Table from '@/components/ui/table';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Database } from '@/types/database';
import { useAuthStore } from '@/store/auth';
import { useDocumentsStore } from '@/store/documents';
const ITEMS_PER_PAGE = 10;

type Document = Database['public']['Tables']['documents']['Row'];



export default function Documents() {
  const { user } = useAuthStore();
  const [view, setView] = useState<'grid' | 'table'>('table');
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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setCurrentDocument({
        title: file.name.replace('.md', ''),
        content,
        doc_type: 'markdown',
      });
      setIsEditing(true);
    } catch (error) {
      console.error('Failed to read file:', error);
    }
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
          onClick={() => void handleDelete(document.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
              <label className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload MD
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
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

          {isEditing ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <textarea
                  placeholder="Write your markdown content here..."
                  value={currentDocument.content ?? ''}
                  onChange={(e) => {
                    setCurrentDocument(prev => ({
                      ...prev,
                      content: e.target.value,
                    }));
                  }}
                  className="w-full h-[calc(100vh-300px)] bg-transparent border border-border rounded-lg px-4 py-2 resize-none font-mono"
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
              <div className="border border-border rounded-lg p-4 overflow-auto h-[calc(100vh-300px)]">
                <h2 className="text-xl font-bold mb-4">{currentDocument.title}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentDocument.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : view === 'table' ? (
            <Table<Document>
              columns={['Title', 'Content', 'Last Updated']}
              data={filteredDocuments}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actions={tableActions}
              renderRow={(doc) => ({
                Title: doc.title,
                Content: <div className="line-clamp-2">{doc.content}</div>,
                'Last Updated': doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A',
              })}
            />
          ) : (
            <Table<Document>
              columns={['Title', 'Content', 'Last Updated']}
              data={filteredDocuments}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actions={tableActions}
              renderRow={(doc) => ({
                Title: doc.title,
                Content: <div className="line-clamp-2">{doc.content}</div>,
                'Last Updated': doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A',
              })}
            />
          )}
        </div>
      )}
    </div>
  );
}
