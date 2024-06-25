import type { IEvent } from '~/interfaces/event';

const items = [
  [
    {
      url: 'https://wutheringwaves-echoes.kurogames-global.com/',
      name: 'Echo Summon Web Event',
      time: {
        start: '2024-04-29 00:00',
        end: '2024-06-06 00:00'
      }
    },
    {
      name: 'Intensive Training – Limited Time EXP Material Double Drop Event',
      time: {
        start: '2024-06-06 04:00',
        end: '2024-06-13 03:59'
      },
      color: '#a5b8d1',
      thumbnail: '/events/covers/intensive-training.webp'
    },
    {
      name: 'Second Coming of Solaris',
      time: {
        start: '2024-06-13 04:00',
        end: '2024-06-27 03:59'
      },
      color: '#141427',
      thumbnail: '/events/covers/second-coming-of-solaris.webp',
      description:
        "Accept Maqi's daily commission and retrieve the items requested for rewards."
    }
  ],
  [
    {
      url: 'https://wutheringwaves.kurogames.com/en/main/news/detail/813',
      name: 'Overdash Club',
      time: {
        start: '2024-05-30 04:00',
        end: '2024-06-17 03:59'
      },
      color: '#c2a262',
      thumbnail:
        'https://hw-media-cdn-mingchao.kurogame.com/object/1716825600000/a3kz8j2pfjc2nyzz9k-1716864253876.jpg'
    },
    {
      name: '"Chord Cleansing" LT Echo Double Drop Event',
      time: {
        start: '2024-06-20 04:00',
        end: '2024-06-27 03:59'
      },
      color: '#6e371e',
      thumbnail: '/events/covers/chord-cleansing.webp',
      description:
        'During the Chord Cleansing event period, players can claim double the rewards from Tacet Suppressions.'
    }
  ],
  {
    name: 'Alloy Smelt – Limited Time Battle Event',
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-27 03:59'
    },
    color: '#181f35',
    thumbnail: '/events/covers/alloy-smelt.webp'
  },
  {
    name: 'Wuthering Exploration',
    time: {
      start: '2024-06-13 10:00',
      end: '2024-06-27 03:59'
    },
    color: '#b19abd',
    thumbnail: '/events/covers/wuthering-exploration.webp',
    description:
      'Complete Exploration Quests daily to get Exploration Points and claim rewards after achieving Exploration Point milestones.'
  },
  // start: jiyan
  {
    name: 'Absolute Pulsation: Verdant Summit – Featured Weapon Convene',
    time: {
      start: '2024-05-23 10:00',
      end: '2024-06-13 09:59'
    },
    color: '#1f5456',
    thumbnail: '/cards/T_Card5.png'
  },
  {
    name: 'Prevail the Lasting Night – Featured Resonator Convene',
    time: {
      start: '2024-05-23 10:00',
      end: '2024-06-13 09:59'
    },
    color: '#1f5456',
    thumbnail: '/cards/T_Card5.png'
  },
  // end: jiyan
  // start: yinlin
  {
    name: 'Absolute Pulsation: Stringmaster – Featured Weapon Convene',
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-26 11:59'
    },
    color: '#721f29',
    thumbnail: '/cards/T_Card19.png'
  },
  {
    name: 'When Thunder Pours – Featured Resonator Convene',
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-26 11:59'
    },
    color: '#721f29',
    thumbnail: '/cards/T_Card19.png'
  }
  // end: yinlin
];
export default items as IEvent[] | IEvent[][];
