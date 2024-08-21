export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const waitUlti = async (ensure: () => boolean) => {
  while (!ensure()) {
    await sleep(25);
  }
};
