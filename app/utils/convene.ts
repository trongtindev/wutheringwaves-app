import moment from 'moment';
import type { IBanner } from '~/interfaces/banner';
import type { IConvene } from '~/interfaces/convene';

export const calculateAvg = (args: { convenes: IConvene[] }) => {
  let fourPity = 0;
  const fourSamples: number[] = [];

  let fivePity = 0;
  const fiveSamples: number[] = [];

  for (let i = args.convenes.length - 1; i >= 0; i -= 1) {
    const convene = args.convenes[i];

    fourPity += 1;
    if (convene.qualityLevel === 4) {
      fourSamples.push(fourPity);
      fourPity = 0;
    }

    fivePity += 1;
    if (convene.qualityLevel === 5) {
      fiveSamples.push(fivePity);
      fivePity = 0;
    }
  }

  const fourAvg =
    fourSamples.reduce((prev, e) => prev + e, 0) / fourSamples.length;
  const fiveAvg =
    fiveSamples.reduce((prev, e) => prev + e, 0) / fiveSamples.length;

  return {
    fourAvg: fourSamples.length >= 2 ? fourAvg : -1,
    fiveAvg: fiveSamples.length >= 2 ? fiveAvg : -1,
  };
};

export const calculateWinRate = (args: {
  type: number;
  banners: IBanner[];
  convenes: IConvene[];
  timeOffset: number;
  qualityLevel: number;
}) => {
  const { type, banners, convenes, timeOffset, qualityLevel } = args;

  let win = 0;
  let lastLoss = false;
  let totalExceptGuaranteed = 0;

  for (let i = convenes.length - 1; i >= 0; i -= 1) {
    const convene = convenes[i];
    if (convene.qualityLevel !== qualityLevel) continue;

    const matchBanners = banners.filter((banner) => {
      if (banner.time) {
        const conveneTime = moment(convene.time).utcOffset(timeOffset);
        const timeStart = moment(banner.time.start)
          .utcOffset(8)
          .add(timeOffset - 8, 'hours');
        const timeEnd = moment(banner.time.end)
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

    const banner = matchBanners[0];
    if (!banner.featuredRare) {
      console.warn(banner.name, 'featuredRare', undefined);
      continue;
    }

    if (
      banner.featuredRare === convene.name ||
      (banner.featuredSecondaryRare &&
        banner.featuredSecondaryRare === convene.name)
    ) {
      win += 1;
      totalExceptGuaranteed += 1;
    } else if (lastLoss) {
      lastLoss = false;
    } else {
      lastLoss = true;
      totalExceptGuaranteed += 1;
    }
  }

  return (win / totalExceptGuaranteed) * 100;
};
