export enum DesktopAppEventType {
  notificationCreate = 'desktopApp.notificationCreate'
}

export enum DesktopAppGameTypes {
  playerInfo = 'game.PlayerInfo',
  objectList = 'game.ObjectList'
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
