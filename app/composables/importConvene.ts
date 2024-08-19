import axios from 'axios';
import moment from 'moment';
import { WeaponDocument } from '~/database/documents/weapon';
import { ConveneDocument } from '~/database/documents/convene';
import { CharacterDocument } from '~/database/documents/character';
import type { ICharacter } from '~/interfaces/character';
import type { IWeapon } from '~/interfaces/weapon';
import type { IConvene } from '~/interfaces/convene';

interface IRecordResult {
  code: number;
  data: any[];
}

export const useImportConvene = defineStore('useImportConvene', () => {
  // uses
  const api = useApi();
  const resources = useResources();
  const database = useDatabase();

  // states
  const onImported = ref<string[]>();

  // functions
  const start = async (url: string) => {
    const characters = await resources.getCharacters();
    const weapons = await resources.getWeapons();

    // parse url
    const uri = new URL(url.replaceAll('index.html#', 'index.html'));
    const languageCode = uri.searchParams.get('lang');
    if (!languageCode) throw new Error('lang not found');
    const serverId = uri.searchParams.get('svr_id');
    if (!serverId) throw new Error('svr_id not found');
    const playerId = uri.searchParams.get('player_id');
    if (!playerId) throw new Error('player_id not found');
    const cardPoolId = uri.searchParams.get('resources_id');
    if (!cardPoolId) throw new Error('resources_id not found');
    const recordId = uri.searchParams.get('record_id');
    if (!recordId) throw new Error('record_id not found');

    // get records
    const recordChunks = await Promise.all(
      Array.from(Array(7).keys()).map((i) => {
        return getRecords({
          cardPoolId,
          cardPoolType: i + 1,
          playerId,
          recordId,
          languageCode,
          serverId,
          characters,
          weapons,
        });
      }),
    );

    // merge records
    const records = recordChunks.flatMap((e) => e.data);

    // check expired
    if (recordChunks.filter((e) => e.code == -1).length > 0) {
      throw new Error('url_expired');
    }

    // initial account
    const [id] = database.accounts.findOne({ playerId });
    if (id) {
      database.accounts.updateOne(
        { playerId },
        {
          serverId,
          conveneHistoryUrl: url,
          lastImport: Date.now(),
        },
      );
    } else {
      database.accounts.insert({
        playerId,
        serverId,
        conveneHistoryUrl: url,
        autoImport: true,
        lastImport: Date.now(),
        createdAt: Date.now(),
      });
    }

    // remove previous history
    database.convenes.deleteMany({ playerId });

    // data calculator
    const conveneWrites = records.map((e, i) => {
      let pity = 1;

      // calc pity
      if (records[i].qualityLevel >= 4) {
        for (let j = i + 1; j < records.length; j += 1) {
          if (records[j].cardPoolType !== records[i].cardPoolType) {
            continue;
          }

          if (records[j].qualityLevel >= records[i].qualityLevel) {
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
    const resonators = records.filter((e) => {
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
              const timeA = moment(a.time);
              const timeB = moment(b.time);
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
    for (const element of records) {
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

    // report statistics
    api.post('/convenes/import', {
      chunks: recordChunks.map((e) => e.data),
      playerId,
      serverId,
    });

    return { playerId };
  };

  const getRecords = async (args: {
    cardPoolId: string;
    cardPoolType: number;
    languageCode: string;
    playerId: string;
    recordId: string;
    serverId: string;
    characters: ICharacter[];
    weapons: IWeapon[];
  }): Promise<{
    data: IConvene[];
    code: number;
  }> => {
    const response = await axios.post<IRecordResult>(
      'https://gmserver-api.aki-game2.net/gacha/record/query',
      {
        cardPoolId: args.cardPoolId,
        cardPoolType: args.cardPoolType,
        languageCode: args.languageCode,
        playerId: args.playerId,
        recordId: args.recordId,
        serverId: args.serverId,
      },
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
      },
    );

    const data = response.data.data;
    return {
      code: response.data.code,
      data: data.map((convene) => {
        const [name, resourceType] = (() => {
          const character = args.characters.find((e) => {
            return e.id === convene.resourceId;
          });
          if (character) {
            return [character.name, 'Resonator'];
          }

          const weapon = args.weapons.find((e) => {
            return e.id === convene.resourceId;
          });
          if (weapon) {
            return [weapon.name, 'Weapon'];
          }

          return [null, null];
        })();

        return {
          name: name || convene.name,
          time: convene.time,
          resourceId: convene.resourceId,
          resourceType: resourceType || convene.resourceType,
          qualityLevel: convene.qualityLevel,
          cardPoolType: args.cardPoolType,
        };
      }),
    };
  };

  // exports
  return { start, onImported };
});
