import type { ILocalized } from '~/interfaces/common';

export interface IEvent {
  url?: string;
  name: string;
  nameLocalized?: ILocalized;
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
    timezoneDependent?: boolean;
  };
  /**
   * Example: #FAE2B4
   */
  color?: string;
}
