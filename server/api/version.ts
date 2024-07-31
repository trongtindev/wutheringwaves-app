export default defineEventHandler(() => {
  return {
    buildNumber: useAppConfig().buildNumber as number,
  };
});
