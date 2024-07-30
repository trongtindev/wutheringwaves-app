import data from '@/resources/banners.json';
import { CardPoolType } from '~/interfaces/banner';

export default defineEventHandler(() => {
  return data.items.map((e) => {
    return {
      ...e,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: CardPoolType[e.type as any],
    };
  });
});
