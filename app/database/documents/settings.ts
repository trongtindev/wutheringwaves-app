export class SettingDocument {
  playerId?: string;
  key: string;
  value: string;
  createdAt: number;

  constructor(args: Partial<SettingDocument>) {
    this.playerId = args.playerId || 'undefined';
    this.key = args.key || 'undefined';
    this.value = args.value || 'undefined';
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
