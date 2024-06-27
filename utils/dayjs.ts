import dayjsLib from 'dayjs';

export const dayjs = (
  date?: string | number | Date | dayjsLib.Dayjs | null | undefined,
  format?: dayjsLib.OptionType | undefined,
  strict?: boolean | undefined
) => {
  const runtimeConfig = useRuntimeConfig();
  return dayjsLib(date, format, strict).tz(runtimeConfig.public.DAYJS_TIMEZONE);
};
