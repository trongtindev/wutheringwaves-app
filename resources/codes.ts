import type { ICode } from '@/interfaces/code';

const items: ICode[] = [
  {
    code: 'WUTHERING2024',
    expiredAt: new Date('5/23/2024'),
    createdAt: new Date('5/22/2024')
  },
  {
    code: 'WUTHERINGWAVESGIFT',
    expiredAt: new Date('5/23/2024'),
    createdAt: new Date('5/22/2024')
  },
  {
    code: 'WUTHERINGGIFT',
    rewards: [
      {
        name: 'Astrite',
        amount: 50
      },
      {
        name: 'Premium Resonance Potion',
        amount: 2
      },
      {
        name: 'Medium Revival Inhaler',
        amount: 2
      },
      {
        name: 'Medium Energy Bag',
        amount: 2
      },
      {
        name: 'Shell Credit',
        amount: 10000
      }
    ],
    expiredAt: undefined,
    createdAt: new Date('5/22/2024')
  }
];
export default items;
