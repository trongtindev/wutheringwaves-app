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
    featured: ['Chixia', 'Danjin', 'Mortefi'],
    thumbnail: '/events/covers/prevail-the-lasting-night.webp'
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-05-23 10:00',
      end: '2024-06-13 09:59'
    },
    name: 'Absolute Pulsation - Jiyan - Verdant Summit',
    featuredRare: 'Verdant Summit',
    featured: ['Dauntless Evernight', 'Variation', 'Hollow Mirage'],
    thumbnail: '/events/covers/absolute-pulsation-verdant-summit.webp'
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
    featured: ['Aalto', 'Taoqi', 'Yuanwu'],
    thumbnail: '/events/covers/when-thunder-pours.webp'
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-06-06 10:00',
      end: '2024-06-26 11:59'
    },
    name: 'Absolute Pulsation - Yinlin - Stringmaster',
    featuredRare: 'Stringmaster',
    featured: ['Jinzhou Keeper', 'Cadenza', 'Lunar Cutter'],
    thumbnail: '/events/covers/stringmaster.webp'
  },
  // featured Jinhsi
  {
    type: CardPoolType['featured-resonator'],
    name: 'Thawborn Renewal - Jinhsi',
    time: {
      start: '2024-06-28 12:00',
      end: '2024-07-22 09:59'
    },
    featuredRare: 'Jinhsi',
    featured: ['Sanhua', 'Danjin', 'Yangyang'],
    thumbnail: '/events/covers/thawborn-renewal.webp'
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-06-28 12:00',
      end: '2024-07-22 09:59'
    },
    name: 'Absolute Pulsation - Jinhsi - Ages of Harvest',
    featuredRare: 'Ages of Harvest',
    featured: ['Discord', 'Commando of Conviction', 'Amity Accord'],
    thumbnail: '/events/covers/ages-of-harvest.webp'
  },
  // featured Changli
  {
    type: CardPoolType['featured-resonator'],
    name: "Vermillion's Ploy - Changli",
    time: {
      start: '2024-07-22 10:00',
      end: '2024-08-14 11:59'
    },
    featuredRare: 'Changli',
    featured: ['Sanhua', 'Taoqi', 'Mortefi'],
    thumbnail: '/events/covers/vermillion-ploy.webp'
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-07-22 10:00',
      end: '2024-08-14 11:59'
    },
    name: 'Absolute Pulsation - Changli - Blazing Brilliance',
    featuredRare: 'Blazing Brilliance',
    featured: ['Comet Flare', 'Scale: Slasher', 'Undying Flame'],
    thumbnail: '/events/covers/blazing-brilliance.webp'
  }
];
export default items;
