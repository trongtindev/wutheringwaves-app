export class ConveneDocument {
  playerId: string;
  name: string;
  time: string;
  qualityLevel: number;
  cardPoolType: number;
  resourceId: number;
  resourceType: string;
  pity: number;
  createdAt: number;

  constructor(args: Partial<ConveneDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.name = args.name || 'undefined';
    this.time = args.time || 'undefined';
    this.cardPoolType = args.cardPoolType || -1;
    this.qualityLevel = args.qualityLevel || -1;
    this.resourceId = args.resourceId || -1;
    this.resourceType = args.resourceType || 'undefined';
    this.pity = args.pity || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
