import type dayjs from 'dayjs';
import type { ConveneDocType } from '~/collections/convene';

export interface IConvene {}

export interface IBannerSummaryListItem {
  item: string;
  total: number;
  percentage: number;
  resourceType: string;
}

export interface IBannerSummary {
  banner: string;
  cardPoolType: number;
  totalPull: number;
  totalUsers: number;
  avgPity: {
    chance: number;
    totalPull: number;
  }[];
  avgRc: {
    item: string;
    stacks: number[];
  }[];
  pullByDay: { time: string; total: number }[];
  fiveStarList: IBannerSummaryListItem[];
  fiveStarWinRate: number[];
  fourStarList: IBannerSummaryListItem[];
  fourStarWinRate: number[];
}

export type ConveneDocumentConverted = ConveneDocType & {
  timeConverted: dayjs.Dayjs;
};
