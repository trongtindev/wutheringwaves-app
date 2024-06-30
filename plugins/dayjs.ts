import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import calendar from 'dayjs/plugin/calendar';

export default defineNuxtPlugin(() => {
  // const runtimeConfig = useRuntimeConfig();

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);
  dayjs.extend(duration);
  dayjs.extend(calendar);

  // dayjs.tz.setDefault(runtimeConfig.public.DAYJS_TIMEZONE);

  return { provide: { dayjs } };
});
