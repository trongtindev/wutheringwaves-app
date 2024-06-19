export interface IComment {
  id: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  content: string;
  updatedAt: string;
  createdAt: string;
}
