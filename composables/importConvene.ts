import dayjs from 'dayjs';

export const useImportConvene = defineStore('useImportConvene', () => {
  // uses
  const api = useApi();
  const account = useAccount();
  const database = useDatabase();
  const resources = useResources();

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
      }[];
      total: number;
    }>('/convenes/import', {
      url,
      userAgent: navigator.userAgent,
    });

    // initial account
    const playerId = response.data.playerId.toString();
    await account.upsert(playerId, response.data.serverId, url);

    // get database instance
    const db = await database.getInstance();

    // remove previous history
    const conveneDeletes = await db.convenes
      .find({
        selector: {
          playerId,
        },
      })
      .exec();
    await db.convenes.bulkRemove(conveneDeletes.map((e) => e._id));

    // data calculator
    const banners = await resources.getBanners();
    const conveneWrites = response.data.items.map((e, i) => {
      let pity = 1;
      let win = false;

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

      // calc win
      if (response.data.items[i].qualityLevel >= 5) {
        const conveneTime = dayjs(response.data.items[i].time);
        const matchBanners = banners
          .filter((e) => {
            return e.type === response.data.items[i].cardPoolType && e.time;
          })
          .filter((banner) => {
            const timeStart = dayjs(banner.time!.start);
            const timeEnd = dayjs(banner.time!.end);
            return timeStart < conveneTime && timeEnd > conveneTime;
          });

        if (matchBanners.length) {
          win =
            matchBanners.findIndex((e) => {
              return e.featuredRare === response.data.items[i].name;
            }) >= 0;
        }
      }

      return {
        _id: randomId(),
        playerId: playerId,
        cardPoolType: e.cardPoolType,
        qualityLevel: e.qualityLevel,
        resourceType: e.resourceType as any,
        name: e.name,
        time: e.time,
        pity,
        win,
        createdAt: new Date(e.time).getTime() - i,
      };
    });
    await db.convenes.bulkInsert(conveneWrites);

    // calc owned
    const resonators = response.data.items.filter((e) => {
      return e.resourceType.startsWith('R');
    });
    const characterObjects = (() => {
      const output = {};
      for (const element of resonators) {
        output[element.name] ??= {
          name: element.name,
          resonanceChain: -1,
          obtainedAt: 0,
        };
        output[element.name].resonanceChain += 1;
        output[element.name].obtainedAt = (() => {
          return resonators
            .filter((e) => e.name === element.name)
            .sort((a, b) => {
              const timeA = dayjs(a.time);
              const timeB = dayjs(b.time);
              return timeA.toDate().getTime() - timeB.toDate().getTime();
            })[0].time;
        })();
      }

      return output;
    })();
    const characterWrites = Object.keys(characterObjects).flatMap((e) => {
      return {
        ...characterObjects[e],
        playerId: playerId,
        key: `${characterObjects[e].name}${playerId}`,
      };
    });

    await db.characters.deleteMany({ playerId });
    await db.characters.bulkUpsert(characterWrites);

    return {
      playerId,
      changes: conveneWrites.length - conveneDeletes.length,
    };
  };

  // exports
  return { start };
});
