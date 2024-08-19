export class AchievementDocument {
  playerId: string;
  slug: string;
  createdAt: number;

  constructor(args: Partial<AchievementDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.slug = args.slug || 'undefined';
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
