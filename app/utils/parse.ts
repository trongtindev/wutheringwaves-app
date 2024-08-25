export const parseContent = (content: string) => {
  const regex = /\["item=(.*?)"\]/g;
  return content.replace(regex, (match, p1) => {
    return `<v-chip>${p1}</v-chip>`;
  });
};

export const parseMarkdown = (input: string) => {
  let output = input;

  // replace \n
  input.replaceAll('\n', '<br/>');

  // Replace headers (e.g., # Header)
  output = output.replace(/(#+) (.*)/g, (_, hashes, content) => {
    const level = hashes.length;
    return `<h${level}>${content}</h${level}>`;
  });

  // Replace bold (**bold** or __bold__)
  output = output.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');

  // Replace italic (*italic* or _italic_)
  output = output.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');

  // Replace inline code (`code`)
  output = output.replace(/`(.*?)`/g, '<code>$1</code>');

  // Replace links ([text](url))
  output = output.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Replace images (![alt text](url))
  output = output.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

  // Replace unordered lists
  output = output.replace(/^\s*[-*+] (.*)/gm, '<li>$1</li>');
  output = output.replace(/<\/li>\n<li>/g, '</li><li>');
  output = output.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

  // Replace ordered lists
  output = output.replace(/^\s*\d+\. (.*)/gm, '<li>$1</li>');
  output = output.replace(/<\/li>\n<li>/g, '</li><li>');
  output = output.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');

  // Replace blockquotes
  output = output.replace(/^\s*> (.*)/gm, '<blockquote>$1</blockquote>');

  return output;
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
