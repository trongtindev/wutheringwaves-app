import markdownit from 'markdown-it';

export const parseContent = (content: string) => {
  const regex = /\["item=(.*?)"\]/g;
  return content.replace(regex, (match, p1) => {
    return `<v-chip>${p1}</v-chip>`;
  });
};

export const parseMarkdown = (input: string) => {
  const md = markdownit({ html: true });
  return md.render(input.replaceAll('\n', '<br/>'));
};

export const parseColours = (input: string) => {
  const replaces = [
    ['Eero DMG', 'aero-electro'],
    ['Havoc DMG', 'color-havoc'],
    ['Spectro DMG', 'color-spectro'],
    ['Electro DMG', 'color-electro'],
    ['Glacio DMG', 'color-glacio'],
    ['Fusion DMG', 'color-fusion'],
  ];
  replaces.forEach((e) => {
    input = input.replaceAll(e[0], `<span class="${e[1]}">${e[0]}</span>`);
  });

  return parseMarkdown(input);
};
