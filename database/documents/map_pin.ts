export class MapPinDocument {
  playerId?: string;
  name: string;
  type: string;
  latLng: number[];
  createdAt: number;

  constructor(args: Partial<MapPinDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.name = args.name || 'undefined';
    this.type = args.type || 'undefined';
    this.latLng = args.latLng || [0, 0];
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
