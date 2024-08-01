import type { IMapCategory } from '~/interfaces/map';

export const mapLocations: {
  latLng: number[];
  name: string;
  items?: {
    latLng: number[];
    name: string;
  }[];
}[] = [
  {
    latLng: [-0.1802979375160789, 0.005358165696494056],
    name: 'dimForest',
  },
  {
    latLng: [-0.1043966774304988, -0.08855785140656548],
    name: 'portCityOfGuixu',
  },
  {
    latLng: [-0.17925832303895856, 0.10233278374131238],
    name: 'whiningAixsMire',
    items: [
      {
        latLng: [-0.2215466202871604, 0.10248184204101564],
        name: 'fallenGrave',
      },
      {
        latLng: [-0.19905107855720808, 0.1659965515136719],
        name: 'frostingHarbor',
      },
      {
        latLng: [-0.15199923965756293, 0.1156139373779297],
        name: 'portGunchao',
      },
      {
        latLng: [-0.17114626125810659, 0.1257419586181641],
        name: 'wavingBattlefield',
      },
      {
        latLng: [-0.17604034003061217, 0.10385513305664064],
        name: 'plateauRuins',
      },
      {
        latLng: [-0.1889194884647421, 0.06445884704589845],
        name: 'lolloWarehouse',
      },
      {
        latLng: [-0.2011976010935387, 0.12539863586425784],
        name: 'courtOfSavantaeRuins',
      },
    ],
  },
  {
    latLng: [-0.07934367718692747, 0.020808950602875246],
    name: 'tigersMaw',
  },
  {
    latLng: [-0.070414096600129, 0.07094327783158327],
    name: 'wumingBay',
  },
  {
    latLng: [-0.0037004631452093664, 0.01648994256422398],
    name: 'jinzhou',
  },
  {
    latLng: [0.03847667345577725, -0.00408494388423275],
    name: 'centralPlains',
  },
  {
    latLng: [0.04500214003640546, -0.08375045016545403],
    name: 'gorgesOfSpirits',
  },
  {
    latLng: [0.11987321999111697, 0.017720054602214933],
    name: 'desorockHighland',
  },
  {
    latLng: [0.22229511621978604, 0.10566760231044192],
    name: 'norfallBarrens',
  },
  {
    latLng: [-0.22180739923083825, 0.3066883708410551],
    name: 'mtFirmament',
    items: [
      {
        latLng: [-0.1896779753093285, 0.2445452815847249],
        name: 'luminousShore',
      },
      {
        latLng: [-0.2349266345878431, 0.26343150074621846],
        name: 'xuanjiRidges',
      },
      {
        latLng: [-0.2656647311431631, 0.3188883079204264],
        name: 'loongsRidge',
      },
      {
        latLng: [-0.24248237442734222, 0.31554029634181197],
        name: 'tianguTree',
      },
      {
        latLng: [-0.2153503808681373, 0.343354546379624],
        name: 'loongsCrest',
      },
      {
        latLng: [-0.20332986159471494, 0.31330828862272236],
        name: 'loongsRest',
      },
      {
        latLng: [-0.21964342119613614, 0.2932202191509559],
        name: 'hongzhen',
      },
    ],
  },
];

export const mapSlugMarker = {
  'belle-poppy': 'z101',
  'wintry-bell': 'z102',
  lanternberry: 'z103',
  'pecok-flower': 'z104',
  iris: 'z106',
  'terraspawn-fungus': 'z107',
  'violet-coral': 'z108',
  'gloom-slough': 'z162',
  'pavo-plum': 'z163',
  coriolus: 'z202',
};
