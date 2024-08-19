export class AccountDocument {
  name?: string;
  playerId: string;
  serverId: string;
  conveneHistoryUrl?: string;
  autoImport?: boolean;
  lastImport?: number;
  createdAt: number;

  constructor(args: Partial<AccountDocument>) {
    this.name = args.name;
    this.playerId = args.playerId || 'undefined';
    this.serverId = args.serverId || 'undefined';
    this.conveneHistoryUrl = args.conveneHistoryUrl;
    this.autoImport = args.autoImport;
    this.lastImport = args.lastImport;
    this.createdAt = args.createdAt || new Date().getTime();
  }
}
