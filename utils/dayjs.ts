import dayjsLib from 'dayjs';

export const timeOffset = {
  Asia: 8,
  China: 8,
  America: -5,
  Europe: 1
};

export const timeOffsetIds = {
  '10cd7254d57e58ae560b15d51e34b4c8': 8, // SEA
  '86d52186155b148b5c138ceb41be9650': 8, // Asia
  '919752ae5ea09c1ced910dd668a63ffb': 8, // HMT(HK, MO, TW)
  '591d6af3a3090d8ea00d8f86cf6d7501': -5, // America
  '6eb2a235b30d05efd77bedb5cf60999e': 1 // Europe
};

export const dayjs = (
  date?: string | number | Date | dayjsLib.Dayjs | null | undefined,
  format?: dayjsLib.OptionType | undefined,
  strict?: boolean | undefined
) => {
  const runtimeConfig = useRuntimeConfig();
  return dayjsLib(date, format, strict).tz(runtimeConfig.public.DAYJS_TIMEZONE);
};

export const getTimeDifference = (compareTo?: dayjsLib.Dayjs) => {
  const now = dayjsLib();
  const local = now.utcOffset();
  const serverTime = now.utcOffset(timeOffset.Asia).utcOffset();
  return serverTime - (compareTo ? compareTo.utcOffset() : local);
};

export const dayjsFormat = (
  date?: string | number | Date | dayjsLib.Dayjs | null | undefined,
  format?: string
) => {
  const i18n = useI18n();

  if (!format) {
    format =
      i18n.locale.value === 'vi' ? 'DD/MM/YYYY - HH:mm' : 'YYYY/MM/DD - HH:mm';
  }

  return dayjs(date).format(format);
};
