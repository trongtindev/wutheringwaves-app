export interface ICode {
  code: string;
  rewards?: {
    item: string;
    quantity: number;
  }[];
  expiredAt?: string;
}
