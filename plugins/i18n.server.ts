import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// states
let listener: fs.FSWatcher;
let mergeQueued: NodeJS.Timeout;
const locales = ['vi']; // exclude 'en'
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

const startMerge = async () => {
  const base = await loadJson('en');
  await Promise.all(
    locales.map(async (locale) => {
      const json = await loadJson(locale);
      const merge = deepMerge(base, json);

      // write
      fs.writeFileSync(`${destination}/${locale}.json`, JSON.stringify(merge));

      // format
      exec(`npx prettier ./locales/${locale}.json --write`, {
        cwd: path.resolve(__dirname, '../')
      });
    })
  );
};

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return;

  if (listener) listener.close();
  listener = fs.watch('./locales/en.json', () => {
    if (mergeQueued) clearTimeout(mergeQueued);
    mergeQueued = setTimeout(() => startMerge(), 500);
  });
});
