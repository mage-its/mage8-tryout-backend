export enum Role {
  ADMIN = 'admin',
  USER = 'user,',
}

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  role?: Role;
  score?: number;
  updatedAt: Date;
  createdAt: Date;
}

export default UserInterface;
