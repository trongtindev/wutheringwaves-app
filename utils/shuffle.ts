export const shuffleArray = <T>(arr: T[]) => {
  return [...arr].map((_, i, arrCopy) => {
    const rand = i + Math.floor(Math.random() * (arrCopy.length - i));
    [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]];
    return arrCopy[i];
  });
};
