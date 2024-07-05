import { timeOffset, timeOffsetIds } from '~/utils/dayjs';

export default defineEventHandler(() => {
  return {
    timeOffset,
    timeOffsetIds
  };
});
