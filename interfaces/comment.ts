import type { IFile } from './file';
import type { IUser } from './user';

export interface IComment {
  id: string;
  user: IUser;
  content: string;
  likes: number;
  dislikes: number;
  updatedAt: string;
  createdAt: string;
  attachments: IFile[];
}
