export interface INotification {
  id: string;
  title: string;
  message?: string;
  icon?: string;
  color?: string;
  progress?: boolean;
  persistent?: boolean;
}
