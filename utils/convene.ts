import dayjs from 'dayjs';
import type { IBanner } from '~/interfaces/banner';
import type { IConvene } from '~/interfaces/convene';

export const calculateWinRate = (args: {
  type: number;
  banners: IBanner[];
  convenes: IConvene[];
  timeOffset: number;
}) => {
  const { type, banners, convenes, timeOffset } = args;

  let win = 0;
  let lastLoss = false;
  let totalExceptGuaranteed = 0;

  for (let i = convenes.length - 1; i >= 0; i -= 1) {
    const convene = convenes[i];
    if (convene.qualityLevel < 5) continue;

    const matchBanners = banners.filter((banner) => {
      if (banner.time) {
        const conveneTime = dayjs(convene.time).utcOffset(timeOffset);
        const timeStart = dayjs(banner.time.start)
          .utcOffset(8)
          .add(timeOffset - 8, 'hours');
        const timeEnd = dayjs(banner.time.end)
          .utcOffset(8)
          .add(timeOffset - 8, 'hours');

        const condition =
          conveneTime >= timeStart &&
          conveneTime <= timeEnd &&
          banner.type === type;
        return condition;
      }
      return banner.type === type;
    });
    if (matchBanners.length == 0) {
      console.warn('matchBanners', convene.name, matchBanners);
      continue;
    }

    const banner = matchBanners.first();
    if (!banner.featuredRare) {
      console.warn(banner.name, 'featuredRare', undefined);
      continue;
    }

    if (
      banner.featuredRare !== convene.name &&
      banner.featuredSecondaryRare &&
      banner.featuredSecondaryRare !== convene.name
    ) {
      lastLoss = true;
      totalExceptGuaranteed += 1;
    } else if (lastLoss) {
      lastLoss = false;
    } else {
      win += 1;
      totalExceptGuaranteed += 1;
    }
  }

  return (win / totalExceptGuaranteed) * 100;
};
