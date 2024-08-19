import fs from 'fs';
import * as prettier from 'prettier';

const path = process.argv[process.argv.length - 1]!;
const config = JSON.parse(fs.readFileSync('./.prettierrc', 'utf-8'));
const ignore = fs
  .readFileSync('./.gitignore', 'utf-8')
  .replaceAll('\r', '')
  .split('\n');

const format = async (file: string) => {
  console.log(file);
  const content = fs.readFileSync(file, 'utf-8');
  const formatted = await prettier.format(
    file.endsWith('.json') ? content.replaceAll('\n', '') : content,
    {
      filepath: file,
      ...config,
    },
  );
  fs.writeFileSync(file, formatted);
};

if (fs.statSync(path).isDirectory()) {
  const files = fs
    .readdirSync(path, { recursive: true, encoding: 'utf-8' })
    .filter((file) => {
      if (
        ignore.find((e) => file.includes(e)) ||
        file.includes('node_modules') ||
        file.includes('prettier.ts')
      ) {
        return false;
      }
      const ext = file.split('.')[file.split('.').length - 1]!;
      return ['ts', 'vue', 'json'].includes(ext);
    });

  for (const file of files) {
    await format(file);
  }
} else {
  await format(path);
}
