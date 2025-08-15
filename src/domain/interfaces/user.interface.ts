export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  SUPPLIER = 'SUPPLIER',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  birthDate: Date;
  gender: Gender;
  role: UserRole;
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  birthDate: Date;
  gender: Gender;
  role?: UserRole;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  country?: string;
  password?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUserAuthTokens {
  accessToken: string;
  refreshToken: string;
} 