export const parseContent = (content: string) => {
  const regex = /\["item=(.*?)"\]/g;
  return content.replace(regex, (match, p1) => {
    return `<v-chip>${p1}</v-chip>`;
  });
};
