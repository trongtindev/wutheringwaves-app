import type moment from 'moment';
import type { ConveneDocument } from '~/database/documents/convene';

export interface IConvene {
  time: string;
  name: string;
  resourceId: number;
  resourceType: string;
  qualityLevel: number;
  cardPoolType: number;
}

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

export type ConveneDocumentConverted = ConveneDocument & {
  timeConverted: moment.Moment;
};
