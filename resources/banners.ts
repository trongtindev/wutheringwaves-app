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
      en: 'Prevail the Lasting Night'
    },
    time: {
      start: new Date('2024-05-22T10:00:00'),
      end: new Date('2024-06-12T10:00:00')
    },
    featuredRare: 'Jiyan',
    featured: ['Chixia', 'Danjin', 'Mortefi']
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: new Date('2024-05-22T10:00:00'),
      end: new Date('2024-06-12T10:00:00')
    },
    name: {
      en: 'Absolute Pulsation - Verdant Summit'
    },
    featuredRare: 'Verdant Summit',
    featured: ['Dauntless Evernight', 'Variation', 'Hollow Mirage']
  },
  // featured Yinlin
  {
    type: CardPoolType['featured-resonator'],
    name: {
      en: 'When Thunder Pours'
    },
    time: {
      start: new Date('2024-06-12T10:00:00'),
      end: new Date('2024-07-02T10:00:00')
    },
    featuredRare: 'Yinlin',
    featured: ['Aalto', 'Taoqi', 'Yuanwu']
  },
  {
    type: CardPoolType['featured-weapon'],
    time: {
      start: new Date('2024-06-12T10:00:00'),
      end: new Date('2024-07-02T10:00:00')
    },
    name: {
      en: 'Absolute Pulsation - Stringmaster'
    },
    featuredRare: 'Stringmaster',
    featured: ['Jinzhou Keeper', 'Cadenza', 'Lunar Cutter']
  }
];
export default items;
