import { useFetchData } from '@/hooks/use-fetch-data'
import { useMutateData } from '@/hooks/use-mutate-data'
import { useSession } from '@/hooks/use-session'
import { formatDate } from '@/utils/format-date'
import { useCallback, useState } from 'react'
import { Edit, FileText, Plus, Search, Trash2 } from 'lucide-react'
import { MutationType } from '@/constants/mutation-type.enum'

export default function DocumentsPage() {
  const { session } = useSession()
  const [search, setSearch] = useState('')
  const { data: documents, isLoading } = useFetchData('documents', {
    userId: session?.user.id
  })

  const { mutate: deleteDocument } = useMutateData('documents', MutationType.DELETE)

  const handleDelete = useCallback(
    (id: number) => {
      deleteDocument({ id })
    },
    [deleteDocument]
  )

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full w-full">
      <div className="flex w-full flex-col gap-4">
        <div className="bg-card h-24 rounded-lg border p-6">FILTER GOES HERE</div>
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <div className="bg-card rounded-lg border p-6">
              <div className="mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Generate Document</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Document Title</label>
                  <input
                    type="text"
                    placeholder="Enter document title..."
                    className="bg-background w-full rounded-md border px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Content</label>
                  <textarea
                    placeholder="Write your document content here..."
                    rows={8}
                    className="bg-background w-full rounded-md border px-4 py-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    /* TODO: Implement generate */
                    console.log('Generate document')
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Generate Document
                </button>
              </div>
            </div>
          </div>

          <div className="h-full w-1/2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Saved Documents</h2>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                  }}
                  className="bg-background w-full rounded-md border py-2 pr-4 pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : !filteredDocuments?.length ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">No documents found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-card hover:bg-accent rounded-lg border p-4 transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">{doc.title}</h3>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(doc.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm capitalize">
                        {doc.doc_type}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            /* TODO: Implement edit */
                          }}
                          className="hover:bg-background rounded-md p-2"
                        >
                          <Edit className="text-muted-foreground h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(doc.id)
                          }}
                          className="hover:bg-destructive/10 rounded-md p-2"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
