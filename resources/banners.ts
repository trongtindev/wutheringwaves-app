import { CardPoolType, type IBanner } from '@/interfaces/banner';

const items: IBanner[] = [
  // beginner
  {
    type: CardPoolType.beginner,
    name: {
      en: 'Beginner Convene'
    }
  },
  {
    type: CardPoolType['beginner-choice'],
    name: {
      en: "Beginner's Choice Convene"
    }
  },
  {
    type: CardPoolType['beginner-choice-custom'],
    name: {
      en: "Beginner's Choice Convene (Giveback Custom Convene)"
    }
  },
  // standard-resonator
  {
    type: CardPoolType['standard-resonator'],
    name: {
      en: 'Standard Resonator Convene'
    }
  },
  {
    type: CardPoolType['standard-weapon'],
    name: {
      en: 'Standard Weapon Convene'
    }
  },
  // featured Jiyan
  {
    type: CardPoolType['featured-resonator'],
    name: {
      en: 'Prevail the Lasting Night - Jiyan'
    },
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
    name: {
      en: 'Absolute Pulsation - Jiyan - Verdant Summit'
    },
    featuredRare: 'Verdant Summit',
    featured: ['Dauntless Evernight', 'Variation', 'Hollow Mirage']
  },
  // featured Yinlin
  {
    type: CardPoolType['featured-resonator'],
    name: {
      en: 'When Thunder Pours - Yinlin'
    },
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
    name: {
      en: 'Absolute Pulsation - Yinlin - Stringmaster'
    },
    featuredRare: 'Stringmaster',
    featured: ['Jinzhou Keeper', 'Cadenza', 'Lunar Cutter']
  },
  // featured Jinhsi
  {
    type: CardPoolType['featured-resonator'],
    name: {
      en: 'Thawborn Renewal - Jinhsi'
    },
    time: {
      start: '2024-06-28 13:00',
      end: '2024-07-22 09:59'
    },
    featuredRare: 'Jinhsi',
    featured: ['Sanhua', 'Danjin', 'Yangyang']
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: '2024-06-28 13:00',
      end: '2024-07-22 09:59'
    },
    name: {
      en: 'Absolute Pulsation - Jinhsi - Ages of Harvest'
    },
    featuredRare: 'Ages of Harvest',
    featured: ['Discord', 'Commando of Conviction', 'Amity Accord']
  }
];
export default items;
