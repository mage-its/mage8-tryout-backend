export enum Role {
  ADMIN = 'admin',
  USER = 'user,',
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  isEmailVerified: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default UserInterface;
