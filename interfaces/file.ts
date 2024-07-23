export interface IFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  metadata?: {
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
