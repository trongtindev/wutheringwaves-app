import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

const echosFile = './resources/echos.json';
const echosSchemaFile = './public/schema/echos.schema.json';

// let charactersListener: fs.FSWatcher;
// const characters = './resources/characters.json';
// const charactersSchema = './public/schema/characters.schema.json';

const runFormat = (file: string) => {
  console.log('runFormat', file);
  exec(`npx prettier ${file} --write`, {
    cwd: path.resolve(__dirname, '../')
  });
};

const onEchoListUpdated = () => {
  console.log('changed', echosFile);

  const json = fs.readFileSync(echosFile, 'utf-8');
  const data: { items: { slug: string }[] } = JSON.parse(json);
  const echosSchemaData: {
    components: {
      schemas: {
        echoSlug: { enum: string[] };
      };
    };
  } = JSON.parse(fs.readFileSync(echosSchemaFile, 'utf-8'));

  echosSchemaData.components.schemas.echoSlug.enum = data.items.map((e) => {
    return e.slug;
  });

  // fs.writeFileSync(echosSchemaFile, JSON.stringify(echosSchemaData));
  // runFormat(echosSchemaFile);
};

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let echosListener: fs.FSWatcher = null as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let echosDebounce: NodeJS.Timeout = null as any;

  if (echosListener) echosListener.close();
  echosListener = fs.watch(echosFile, () => {
    console.log('echosListener');
    if (echosDebounce) {
      console.log('echosListener clear');
      clearTimeout(echosDebounce);
    }
    echosDebounce = setTimeout(() => onEchoListUpdated(), 1000);
  });
});
