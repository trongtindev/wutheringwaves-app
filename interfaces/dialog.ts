type DialogColor = 'error' | 'warning' | 'info' | 'success' | undefined;

export interface IDialogParams {
  title: string;
  content?: string;

  persistent?: boolean;
  width?: string | number;
  height?: string | number;
  color?: DialogColor;
  actions?: {
    text?: string;
    color?: string;
    callback?: Promise<void> | void;
  }[];

  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;

  onOpen?: () => Promise<void> | void;
  onClose?: () => Promise<void> | void;

  onCancel?: () => Promise<void> | void;
  onConfirm?: () => Promise<void> | void;
}
