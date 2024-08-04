import dayjs from 'dayjs';
import { CharacterDocument } from './database';

export const useImportConvene = defineStore('useImportConvene', () => {
  // uses
  const api = useApi();
  const database = useDatabase();

  // states
  const onImported = ref<string[]>();

  // functions
  const start = async (url: string) => {
    // get records
    const response = await api.post<{
      playerId: number;
      serverId: string;
      items: {
        time: string;
        name: string;
        qualityLevel: number;
        cardPoolType: number;
        resourceType: string;
        resourceId: number;
      }[];
      total: number;
    }>('/convenes/import', {
      url,
      userAgent: navigator.userAgent,
    });

    // initial account
    const playerId = response.data.playerId.toString();
    const [id] = database.accounts.findOne({ playerId });
    if (id) {
      database.accounts.updateOne(
        { playerId },
        {
          serverId: response.data.serverId,
          conveneHistoryUrl: url,
          lastImport: Date.now(),
        },
      );
    } else {
      database.accounts.insert({
        playerId,
        serverId: response.data.serverId,
        conveneHistoryUrl: url,
        autoImport: true,
        lastImport: Date.now(),
        createdAt: Date.now(),
      });
    }

    // remove previous history
    database.convenes.deleteMany({ playerId });

    // data calculator
    const conveneWrites = response.data.items.map((e, i) => {
      let pity = 1;

      // calc pity
      if (response.data.items[i].qualityLevel >= 4) {
        for (let j = i + 1; j < response.data.items.length; j += 1) {
          if (
            response.data.items[j].cardPoolType !==
            response.data.items[i].cardPoolType
          ) {
            continue;
          }

          if (
            response.data.items[j].qualityLevel >=
            response.data.items[i].qualityLevel
          ) {
            break;
          } else {
            pity += 1;
          }
        }
      }

      return new ConveneDocument({
        playerId: playerId,
        cardPoolType: e.cardPoolType,
        qualityLevel: e.qualityLevel,
        resourceType: e.resourceType,
        name: e.name,
        time: e.time,
        pity,
        createdAt: new Date(e.time).getTime() - i,
      });
    });
    database.convenes.bulkInsert(conveneWrites);

    // calculate characters
    const resonators = response.data.items.filter((e) => {
      return e.resourceType.startsWith('R');
    });
    const characterObjects = (() => {
      const output: { [key: number]: CharacterDocument } = {};
      for (const element of resonators) {
        output[element.resourceId] ??= new CharacterDocument({
          resourceId: element.resourceId,
          sequences: -1,
          obtainedAt: 0,
        });
        output[element.resourceId].sequences += 1;
        output[element.resourceId].obtainedAt = (() => {
          const time = resonators
            .filter((e) => e.name === element.name)
            .sort((a, b) => {
              const timeA = dayjs(a.time);
              const timeB = dayjs(b.time);
              return timeA.toDate().getTime() - timeB.toDate().getTime();
            })[0].time;
          return new Date(time).getTime();
        })();
      }

      return output;
    })();
    const characterWrites = Object.keys(characterObjects).flatMap((e) => {
      return new CharacterDocument({
        ...characterObjects[e],
        playerId: playerId,
        key: `${characterObjects[e].name}${playerId}`,
      });
    });

    database.characters.deleteMany({ playerId });
    database.characters.bulkInsert(characterWrites);

    // calculator weapons
    const weaponCounts: {
      [key: string]: {
        count: number;
        resourceId: number;
      };
    } = {};
    for (const element of response.data.items) {
      if (!element.resourceType.startsWith('W')) continue;
      weaponCounts[element.name] ??= {
        count: 0,
        resourceId: element.resourceId,
      };
      weaponCounts[element.name].count += 1;
    }

    const weaponsWrites = Object.keys(weaponCounts).map((e) => {
      return new WeaponDocument({
        ...weaponCounts[e],
        playerId,
      });
    });

    database.weapons.deleteMany({ playerId });
    database.weapons.bulkInsert(weaponsWrites);

    // trigger event
    onImported.value = [playerId, randomId()];

    return { playerId };
  };

  // exports
  return { start, onImported };
});
