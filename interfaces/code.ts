export interface ICode {
  code: string;
  rewards?: {
    name: string;
    amount: number;
  }[];
  expiredAt?: Date;
  createdAt: Date;
}
