export interface INotification {
  id: string;
  title: string;
  message?: string;
  icon?: string;
  color?: string;
  progress?: number;
  persistent?: boolean;
}
