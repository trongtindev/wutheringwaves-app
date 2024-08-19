import { defineNuxtModule } from 'nuxt/kit';
import { updateModified } from './runtime/update-modified';

export default defineNuxtModule({
  meta: {
    name: 'resources',
  },
  hooks: {
    'builder:watch': async (e, path) => {
      if (e != 'change') return;

      // update resources
      if (path.startsWith('resources')) {
        if (
          path.startsWith('resources/characters') &&
          !path.endsWith('characters.json')
        ) {
          await updateModified('characters');
        } else if (
          path.startsWith('resources/echoes') &&
          !path.endsWith('echoes.json')
        ) {
          await updateModified('echoes');
        } else if (
          path.startsWith('resources/items') &&
          !path.endsWith('items.json')
        ) {
          await updateModified('items');
        } else if (
          path.startsWith('resources/weapons') &&
          !path.endsWith('weapons.json')
        ) {
          await updateModified('weapons');
        }
      }
    },
  },
});
