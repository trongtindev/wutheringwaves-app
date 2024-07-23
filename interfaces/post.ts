import type { IFile } from './file';
import type { IUser } from './user';

export interface IPostCategory {
  id: string;
  slug: string;
  name: string;
  nameLocalized: { [key: string]: string };
}

export interface IPost {
  id: string;
  user: IUser;
  slug: string;
  locale: string;
  title: string;
  titleLocalized: { [key: string]: string };
  description: string;
  descriptionLocalized: { [key: string]: string };
  content: string;
  contentLocalized: { [key: string]: string };
  thumbnail: IFile;
  attachments?: IFile[];
  views: number;
  updatedAt: Date;
  createdAt: Date;
  categories: IPostCategory[];
}
