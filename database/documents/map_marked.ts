export class MapMarkedDocument {
  playerId?: string;
  pinId: number;
  createdAt: number;

  constructor(args: Partial<MapMarkedDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.pinId = args.pinId || -1;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
