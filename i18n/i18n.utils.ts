import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// define
const destination = './locales';

// functions
const loadJson = async (locale: string) => {
  return JSON.parse(fs.readFileSync(`${destination}/${locale}.json`, 'utf-8'));
};

const deepMerge = (obj1: object, obj2: object) => {
  const result: object = {};

  for (const key of Object.keys(obj1)) {
    if (typeof obj1[key] === 'string') {
      if (obj2 && obj2[key]) {
        result[key] = obj2[key];
      } else {
        result[key] = obj1[key];
      }
    } else if (typeof obj2[key] === 'undefined') {
      result[key] = obj1[key];
    } else {
      result[key] = deepMerge(obj1[key], obj2[key]);
    }
  }

  return result;
};

export const startMerge = async (locales: string[]) => {
  const base = await loadJson('en');
  await Promise.all(
    locales.map(async (locale) => {
      const json = await loadJson(locale);
      const merge = deepMerge(base, json);

      const stringify = JSON.stringify(merge);
      if (stringify.length == 0) return;
      const file = path.resolve(`./locales/${locale}.json`);
      fs.writeFileSync(file, stringify);

      await new Promise((resolve) => {
        exec(`npx prettier ${file} --write`, {
          cwd: path.resolve(__dirname)
        }).on('exit', resolve);
      });
    })
  );
};
