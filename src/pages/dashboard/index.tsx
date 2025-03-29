import ProgressCard from '@/components/dashboard/progress-card';
import RecentApplications from '@/components/dashboard/recent-applications';
import { StatsSection } from '@/components/dashboard/stats-section';
import TasksWidget from '@/components/dashboard/tasks-widget';
import UpcomingInterviews from '@/components/dashboard/upcoming-interviews';
import { useSession } from '@/hooks/use-session';

export default function DashboardPage() {
  const { session } = useSession();
  return (
    <div className="w-full">
      <main className="mx-auto max-w-[100rem] px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Welcome back, {session?.user.user_metadata.name}!
          </h2>
          <p className="mt-1 text-gray-600">Here's what's happening with your job search today.</p>
        </div>

        <StatsSection />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Applications</h3>
                <button
                  type="button"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  View All
                </button>
              </div>
              <RecentApplications />
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <button
                  type="button"
                      className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  + Add Task
                </button>
              </div>
              <TasksWidget />
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                <button
                  type="button"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  + Schedule Interview
                </button>
              </div>
              <UpcomingInterviews />
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Study Progress</h3>
                <button
                  type="button"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  View Questions
                </button>
              </div>
              <ProgressCard />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
