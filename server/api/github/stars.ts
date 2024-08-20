export default defineEventHandler(async (event) => {
  const stars = await cachedGHStars(event).catch((error) => {
    console.error(error);
    return -1;
  });
  return stars;
});
