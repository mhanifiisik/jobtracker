import type { Application } from '@/types/database';
import type { StatusChartData } from '@/types/chart-data';
import { STATUS_CHART_COLORS } from '@/constants/chart-colors';

export function getApplicationStatusChartData(
  applications: Application[] | null
): StatusChartData[] {
  return [
    {
      name: 'Applied',
      value: applications?.filter(app => app.status === 'applied').length ?? 0,
      color: STATUS_CHART_COLORS.applied,
    },
    {
      name: 'In Interview',
      value: applications?.filter(app => app.status === 'in interview').length ?? 0,
      color: STATUS_CHART_COLORS.inInterview,
    },
    {
      name: 'Rejected',
      value: applications?.filter(app => app.status === 'rejected').length ?? 0,
      color: STATUS_CHART_COLORS.rejected,
    },
    {
      name: 'Offered',
      value: applications?.filter(app => app.status === 'ready for review').length ?? 0,
      color: STATUS_CHART_COLORS.offered,
    },
  ];
}
