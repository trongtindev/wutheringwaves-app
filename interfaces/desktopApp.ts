export enum DesktopAppEventType {
  notificationCreate = 'desktopApp.notificationCreate',
}

export enum DesktopAppGameType {
  playerInfo = 'game.playerInfo',
  objectList = 'game.objectList',
}

export interface IDesktopAppActor {
  address: number;
  hidden: boolean;
  path: string;
  r: number;
  type: string;
  x: number;
  y: number;
  z: number;
}
