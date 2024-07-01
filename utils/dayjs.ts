import dayjsLib from 'dayjs';

const timeOffset = {
  Asia: 8,
  China: 8,
  America: -5,
  Europe: 1
};

export const dayjs = (
  date?: string | number | Date | dayjsLib.Dayjs | null | undefined,
  format?: dayjsLib.OptionType | undefined,
  strict?: boolean | undefined
) => {
  const runtimeConfig = useRuntimeConfig();
  return dayjsLib(date, format, strict).tz(runtimeConfig.public.DAYJS_TIMEZONE);
};

export const getTimeDifference = () => {
  const now = dayjsLib();
  const local = now.utcOffset();
  const serverTime = now.utcOffset(timeOffset.Asia).utcOffset();
  return serverTime - local;
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
