
export type TimeRangeOption = 'This Week' | 'This Month' | 'This Year';

export interface StatCardTrend {
  value: string;
  label: string;
  positive: boolean;
}

export interface StatusChartData {
  name: string;
  value: number;
  color: string;
}
