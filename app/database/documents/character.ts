export class CharacterDocument {
  playerId: string;
  resourceId: number;
  sequences: number;
  obtainedAt: number;
  createdAt: number;

  constructor(args: Partial<CharacterDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.resourceId = args.resourceId || 0;
    this.sequences = args.sequences || 0;
    this.obtainedAt = args.obtainedAt || 0;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
