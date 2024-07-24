import type { LocaleObject } from '@nuxtjs/i18n';
import type { ICharacterData } from '../interfaces/character';
import { exec } from 'child_process';
import fs from 'fs';

export const updateTranslations = async (
  localesMetadata: LocaleObject[],
  isHotReload?: boolean
) => {
  console.log('modules:before');
  const resourceTypes = ['characters'];

  for (const resourceType of resourceTypes) {
    for (const locale of localesMetadata) {
      const itemDir = `./locales/${locale.code}/${resourceType}`;
      if (!fs.existsSync(itemDir)) {
        fs.mkdirSync(itemDir);
      }
    }

    const resourceFile = `./resources/${resourceType}.json`;
    const resourceItems: { items: any[] } = JSON.parse(
      fs.readFileSync(resourceFile, 'utf-8')
    );

    for (const resourceItem of resourceItems.items) {
      for (const locale of localesMetadata) {
        const resourceItemFile = `./resources/${resourceType}/${resourceItem.slug}.json`;
        const resourceItemData = JSON.parse(
          fs.readFileSync(resourceItemFile, 'utf-8')
        );
        const translationItemFile = `./locales/${locale.code}/${resourceType}/${resourceItem.slug}.json`;
        const translationItemContent = (() => {
          if (fs.existsSync(translationItemFile)) {
            return JSON.parse(fs.readFileSync(translationItemFile, 'utf-8'));
          }
          return {};
        })();

        if (locale.code === 'en') {
          translationItemContent.name = resourceItem.name;

          if (resourceType == 'characters') {
            const data = resourceItemData as ICharacterData;
            translationItemContent.quote = data.quote;
            translationItemContent.description = data.description;

            if (data.skills) {
              translationItemContent.skills = Object.fromEntries(
                data.skills.map((e) => [
                  e.slug,
                  {
                    name: e.name,
                    description: e.description
                  }
                ])
              );
            }
          }
        } else {
          if (
            resourceItem.nameLocalized &&
            resourceItem.nameLocalized[locale.code]
          ) {
            translationItemContent.name =
              resourceItem.nameLocalized[locale.code];
          }

          if (resourceType == 'characters') {
            const data = resourceItemData as ICharacterData;

            if (
              data.quoteLocalized &&
              data.quoteLocalized[locale.code] &&
              !translationItemContent.quote
            ) {
              translationItemContent.quote = data.quoteLocalized[locale.code];
            }
          }
        }

        fs.writeFileSync(
          translationItemFile,
          JSON.stringify(translationItemContent)
        );
      }
    }
  }

  await new Promise((resolve) => {
    exec('npx prettier ../locales --write', {
      cwd: __dirname
    }).on('exit', resolve);
  });

  console.log('modules:before', 'done');
};
