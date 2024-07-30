export interface IUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export type UserRole =
  | 'Owner'
  | 'Manager'
  | 'Moderator'
  | 'Content Writer'
  | 'Contributor'
  | 'Member';

export enum UserRoleColor {
  Owner = '#ff0000',
  Manager = '',
}

export interface IUserRole {
  role: UserRole;
  status: boolean;
}
