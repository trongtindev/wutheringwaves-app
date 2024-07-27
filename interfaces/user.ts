export interface IUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export type UserRole = 'Owner' | 'Manager' | 'Member';

export interface IUserRole {
  role: UserRole;
  status: boolean;
}
