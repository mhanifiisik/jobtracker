import { useCallback, useState, useMemo, useEffect } from 'react';
import { Search, Trash, LayoutGrid, Table as TableIcon } from 'lucide-react';
import Table from '@/components/ui/table';
import { useApplicationsStore } from '@/store/applications';
import type { Tables } from '@/types/database';
import { JOB_STATUSES } from '@/constants/job-statuses.constant';

type JobApplication = Tables<'job_applications'>;

const ITEMS_PER_PAGE = 10;




function ApplicationsPage() {
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);


  const { applications,isLoading, fetchApplications,updateApplication,deleteApplication } = useApplicationsStore();

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);




  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteApplication(id);
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    },
    [deleteApplication]
  );

  const handleStatusChange = useCallback(
    async (id: number, newStatus: Tables<'job_applications'>['status']) => {
      await updateApplication(id, { status: newStatus });
    },
    [updateApplication]
  );

  const filteredApplications= useMemo(() => {
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

  const tableActions = (application: Tables<'job_applications'>) => {
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
    <div className="w-full">
      <main className="mx-auto max-w-[100rem] px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Applications</h1>
      </div>
      {isLoading ? (
        <div className="border-muted bg-background flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
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
                {Object.values(JOB_STATUSES).map(option => (
                  <option key={option} value={option}>
                    {option}
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
            </div>
          </div>

          {view === 'table' ? (
            <Table<JobApplication>
              columns={['Company', 'Position', 'Location', 'Date Applied', 'Status']}
              data={paginatedApplications}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actions={tableActions}
              renderRow={(app) => ({
                Company: app.company_name,
                Position: app.position_title,
                Location: app.location,
                'Date Applied': app.date_applied ? new Date(app.date_applied).toLocaleDateString() : 'N/A',
                Status: (
                  <select
                    className="bg-transparent border border-border rounded px-2 py-1"
                    value={app.status}
                    onChange={(e) => {
                      void handleStatusChange(app.id, e.target.value as JobApplication['status']);
                    }}
                  >
                    {Object.values(JOB_STATUSES).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ),
              })}
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
                          void handleStatusChange(application.id, e.target.value as JobApplication['status']);
                        }}
                      >
                        {Object.values(JOB_STATUSES).map(option => (
                          <option key={option} value={option}>
                            {option}
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
      </main>
    </div>
  );
}

export default ApplicationsPage;
