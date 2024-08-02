import type dayjs from 'dayjs';
import type { ILocalized } from '~/interfaces/common';

export interface ITimeline {
  url?: string;
  officialUrl?: string;
  name: string;
  nameLocalized?: ILocalized;
  description?: string;
  descriptionLocalized?: ILocalized;
  thumbnail?: string;
  thumbnailLocalized?: ILocalized;
  time: {
    /**
     * Example: 2021-03-16 13:00:00
     */
    start: string;
    /**
     * Example: 2021-03-16 13:00:00
     */
    end: string;
  };
  /**
   * Example: #FAE2B4
   */
  color?: string;
}

export interface ITimelineEvent extends ITimeline {
  index: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  duration: number;
}
