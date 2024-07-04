export interface IConvene {}

export interface IBannerSummaryListItem {
  item: string;
  total: number;
  percentage: number;
  resourceType: string;
}

export interface IBannerSummary {
  banner: string;
  totalPull: number;
  totalUsers: number;
  pullByDay: { time: string; total: number }[];
  fiveStarList: IBannerSummaryListItem[];
  fourStarList: IBannerSummaryListItem[];
}
