import { useCallback, useState, useMemo } from 'react';
import { useSession } from '@/hooks/use-session';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useMutateData } from '@/hooks/use-mutate-data';
import { Search, Trash, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { MutationType } from '@/constants/mutation-type.enum';
import Table from '@/components/ui/table';

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'in interview', label: 'In Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'wishlist', label: 'Wishlist' },
] as const;

export default function Applications() {
  const { session } = useSession();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: applications, isLoading } = useFetchData('job_applications', {
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

  const { mutateAsync: deleteApplication } = useMutateData('job_applications', MutationType.DELETE);
  const { mutateAsync: updateApplication } = useMutateData('job_applications', MutationType.UPDATE);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!id) {
        return;
      }
      try {
        await deleteApplication({ id });
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    },
    [deleteApplication]
  );

  const handleStatusChange = useCallback(
    async (id: number, newStatus: string) => {
      await updateApplication({ id, status: newStatus });
    },
    [updateApplication]
  );

  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    return applications.filter(app => {
      const matchesSearch = search.toLowerCase() === ''
        || app.company_name.toLowerCase().includes(search.toLowerCase())
        || app.position_title.toLowerCase().includes(search.toLowerCase())
        || app.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setCurrentPage(p => {
      if (direction === 'prev') {
        return Math.max(1, p - 1);
      }
      return Math.min(totalPages, p + 1);
    });
  };

  const tableActions = (application: any) => {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            void handleDelete(application.id);
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
        <h1 className="text-foreground text-2xl font-bold">Applications</h1>
      </div>
      {isLoading ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">Loading applications...</p>
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">No applications found</p>
          <p className="text-muted-foreground text-sm">
            Add your first application to start tracking
          </p>
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
              <select
                className="border border-border px-4 py-2 rounded-lg bg-transparent"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
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
              <button type="button" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                Add Application
              </button>
            </div>
          </div>

          {view === 'table' ? (
            <Table
              columns={['Company', 'Position', 'Location', 'Date Applied', 'Status']}
              data={filteredApplications.map(app => ({
                Company: app.company_name,
                Position: app.position_title,
                Location: app.location,
                'Date Applied': app.updated_at ? new Date(app.updated_at).toLocaleDateString() : 'N/A',
                Status: (
                  <select
                    className="bg-transparent border border-border rounded px-2 py-1"
                    value={app.status}
                    onChange={(e) => {
                      void handleStatusChange(app.id, e.target.value);
                    }}
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ),
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actions={tableActions}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedApplications.map(application => (
                <div
                  key={application.id}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-foreground">{application.position_title}</h3>
                      <p className="text-muted-foreground text-sm">{application.company_name}</p>
                    </div>
                    {tableActions(application)}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{application.location}</p>
                    <p className="text-sm text-muted-foreground">
                      Applied: {application.updated_at ? new Date(application.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                    <div>
                      <select
                        className="bg-transparent border border-border rounded px-2 py-1 text-sm w-full"
                        value={application.status}
                        onChange={(e) => {
                          void handleStatusChange(application.id, e.target.value);
                        }}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
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
