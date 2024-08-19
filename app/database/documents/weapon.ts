export class WeaponDocument {
  playerId: string;
  count: number;
  resourceId: number;
  createdAt: number;

  constructor(args: Partial<WeaponDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.count = args.count || -1;
    this.resourceId = args.resourceId || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
