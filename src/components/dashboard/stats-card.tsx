import type { ReactNode } from 'react';

interface TrendProps {
  value: string;
  label: string;
  positive: boolean;
}

interface StatsCardProps {
  title: string;
  value: string;
  trend?: TrendProps;
  icon: ReactNode;
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm transition-all hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-muted-foreground font-medium tracking-tight">{title}</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-full p-2">
            <div className="text-lg">{icon}</div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${
                  trend.positive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-muted-foreground text-xs">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
