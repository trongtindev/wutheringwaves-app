import type { IEcho } from '@/interfaces/echo';
import json from './echos.json';

// TODO: maybe delete class here
const items = json as IEcho[];
export default items.map((e) => {
  return {
    ...e,
    class: (() => {
      switch (e.cost) {
        case 1:
          return 'Common';
        case 3:
          return 'Elite';
        case 4:
          if (['dreamless', 'bell-borne-geochelone'].includes(e.slug)) {
            return 'Calamity';
          }
          return 'Overlord';
      }
    })()
  };
}) as IEcho[];
