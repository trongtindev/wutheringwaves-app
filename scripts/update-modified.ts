import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('./resources');
const formatCode = (file: string) => {
  return new Promise((resolve, reject) => {
    const process = exec(`npx prettier ${file} --write`, {
      cwd: path.resolve(__dirname, '../')
    });
    process.on('error', reject);
    process.on('exit', resolve);
  });
};

const updateTime = (type: string) => {
  const file = path.resolve(rootDir, `${type}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

  data.items.forEach((e: any) => {
    const stat = fs.statSync(path.resolve(rootDir, `${type}/${e.slug}.json`));
    if (!e.publishedTime) e.publishedTime = stat.birthtime.toISOString();
    e.modifiedTime = stat.atime.toISOString();
  });

  fs.writeFileSync(file, JSON.stringify(data));
  formatCode(file);
};

updateTime('characters');
updateTime('weapons');
updateTime('echos');
updateTime('items');
