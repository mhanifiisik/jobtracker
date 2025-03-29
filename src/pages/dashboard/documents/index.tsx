import { useCallback, useState, useMemo } from 'react';
import { useSession } from '@/hooks/use-session';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { Search, Trash, LayoutGrid, Table as TableIcon, Plus, Save, Upload,Eye } from 'lucide-react';
import { MutationType } from '@/constants/mutation-type.enum';
import Table from '@/components/ui/table';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Database } from '@/types/database';

const ITEMS_PER_PAGE = 10;

type Document = Database['public']['Tables']['documents']['Row'];

interface TableDocument {
  Title: string;
  Content: React.ReactElement;
  'Last Updated': string;
}

export default function Documents() {
  const { session } = useSession();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Partial<Document>>({
    title: '',
    content: '',
    doc_type: 'markdown',
    file_type: 'markdown',
  });

  const { data: documents, isLoading } = useFetchData('documents', {
    userId: session?.user.id,
    orderBy: 'updated_at',
    order: 'desc',
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    range: {
      from: (currentPage - 1) * ITEMS_PER_PAGE,
      to: currentPage * ITEMS_PER_PAGE,
    },
  });

  const { mutateAsync: deleteDocument } = useMutateData('documents', MutationType.DELETE);
  const { mutateAsync: createDocument } = useMutateData('documents', MutationType.INSERT);
  const { mutateAsync: updateDocument } = useMutateData('documents', MutationType.UPDATE);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!id) {
        return;
      }
      try {
        await deleteDocument({ id });
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
          await updateDocument({
            id: currentDocument.id,
            title: currentDocument.title,
            content: currentDocument.content,
            doc_type: 'markdown',
          });
        } else {
          await createDocument({
            title: currentDocument.title,
            content: currentDocument.content,
            user_id: session?.user.id,
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
    [currentDocument, createDocument, updateDocument, session?.user.id]
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
    if (!documents) return [];

    return documents.filter(doc => {
      return search.toLowerCase() === ''
        || doc.title.toLowerCase().includes(search.toLowerCase())
        || doc.content.toLowerCase().includes(search.toLowerCase());
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

  const tableActions = (document: TableDocument): React.ReactElement => {
    const originalDoc = filteredDocuments.find(doc => doc.title === document.Title);
    if (!originalDoc) return <></>;

    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            handleEdit(originalDoc);
          }}
          className="text-muted-foreground hover:text-primary"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            void handleDelete(originalDoc.id);
          }}
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
                  value={currentDocument.content}
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
            <Table<TableDocument>
              columns={['Title', 'Content', 'Last Updated']}
              data={filteredDocuments.map(doc => ({
                Title: doc.title,
                Content: (
                  <div className="max-w-md truncate">
                    {doc.content}
                  </div>
                ),
                'Last Updated': doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A',
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actions={tableActions}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-foreground">{doc.title}</h3>
                    {tableActions({ Title: doc.title, Content: <></>, 'Last Updated': '' })}
                  </div>
                  <div className="space-y-2">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {doc.content}
                      </ReactMarkdown>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
