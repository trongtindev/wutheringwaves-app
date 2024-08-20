interface IRepo {
  stargazers_count: number;
}

export const cachedGHStars = defineCachedEventHandler(
  async () => {
    const { GITHUB_OWNER, GITHUB_REPO } = useRuntimeConfig().public;
    const data: IRepo = await $fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
    );
    return data.stargazers_count;
  },
  {
    maxAge: 60 * 60,
    name: 'ghStars',
  },
);
