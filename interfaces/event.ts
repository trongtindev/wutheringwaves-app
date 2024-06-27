import type { ILocalized } from '~/interfaces/common';
import type { Dayjs } from 'dayjs';

export interface IEvent {
  url?: string;
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

export interface IEventConverted extends IEvent {
  index: number;
  start: Dayjs;
  end: Dayjs;
  duration: any;
  offset: any;
  startOnly: any;
}
