import moment from 'moment';

export const timeOffset = {
  Asia: 8,
  China: 8,
  America: -5,
  Europe: 1,
};

export const timeOffsetIds = {
  '10cd7254d57e58ae560b15d51e34b4c8': 8, // SEA
  '86d52186155b148b5c138ceb41be9650': 8, // Asia
  '919752ae5ea09c1ced910dd668a63ffb': 8, // HMT(HK, MO, TW)
  '591d6af3a3090d8ea00d8f86cf6d7501': -5, // America
  '6eb2a235b30d05efd77bedb5cf60999e': 1, // Europe
};

export const getTimeOffset = () => {
  return timeOffset.China;
};

export const getTimeDifference = () => {
  const now = moment();
  const local = now.utcOffset();
  const serverTime = now.utcOffset(getTimeOffset()).utcOffset();
  return serverTime - local;
};

export const getTimeDifferenceAsia = () => {
  const now = moment();
  const local = now.utcOffset();
  const serverTime = now.utcOffset(timeOffset.Asia).utcOffset();
  return serverTime - local;
};

export const getServerTime = () => {
  return moment().utcOffset(8);
};

export const toServerTime = (time: string, timeOffset: number) => {
  return moment(time)
    .utcOffset(8)
    .add(timeOffset - 8, 'hours');
};
