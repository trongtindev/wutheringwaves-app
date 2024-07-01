import { CardPoolType, type IBanner } from '@/interfaces/banner';

const items: IBanner[] = [
  // beginner
  {
    type: CardPoolType.beginner,
    name: 'Beginner Convene'
  },
  {
    type: CardPoolType['beginner-choice'],
    name: "Beginner's Choice Convene"
  },
  {
    type: CardPoolType['beginner-choice-custom'],
    name: "Beginner's Choice Convene (Giveback Custom Convene)"
  },
  // standard-resonator
  {
    type: CardPoolType['standard-resonator'],
    name: 'Standard Resonator Convene'
  },
  {
    type: CardPoolType['standard-weapon'],
    name: 'Standard Weapon Convene'
  },
  // featured Jiyan
  {
    type: CardPoolType['featured-resonator'],
    name: 'Prevail the Lasting Night - Jiyan',
    time: {
      start: '2024-05-23 10:00',
      end: '2024-06-13 09:59'
    },
    featuredRare: 'Jiyan',
    featured: ['Chixia', 'Danjin', 'Mortefi']
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-05-23 10:00',
      end: '2024-06-13 09:59'
    },
    name: 'Absolute Pulsation - Jiyan - Verdant Summit',
    featuredRare: 'Verdant Summit',
    featured: ['Dauntless Evernight', 'Variation', 'Hollow Mirage']
  },
  // featured Yinlin
  {
    type: CardPoolType['featured-resonator'],
    name: 'When Thunder Pours - Yinlin',
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-26 11:59'
    },
    featuredRare: 'Yinlin',
    featured: ['Aalto', 'Taoqi', 'Yuanwu']
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-26 11:59'
    },
    name: 'Absolute Pulsation - Yinlin - Stringmaster',
    featuredRare: 'Stringmaster',
    featured: ['Jinzhou Keeper', 'Cadenza', 'Lunar Cutter']
  },
  // featured Jinhsi
  {
    type: CardPoolType['featured-resonator'],
    name: 'Thawborn Renewal - Jinhsi',
    time: {
      start: '2024-06-28 13:00',
      end: '2024-07-22 09:59'
    },
    featuredRare: 'Jinhsi',
    featured: ['Sanhua', 'Danjin', 'Yangyang'],
    thumbnail: '/events/covers/thawborn-renewal.webp'
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-06-28 13:00',
      end: '2024-07-22 09:59'
    },
    name: 'Absolute Pulsation - Jinhsi - Ages of Harvest',
    featuredRare: 'Ages of Harvest',
    featured: ['Discord', 'Commando of Conviction', 'Amity Accord'],
    thumbnail: '/events/covers/ages-of-harvest.webp'
  }
];
export default items;
