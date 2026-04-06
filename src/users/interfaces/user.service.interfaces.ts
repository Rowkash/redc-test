import { UserStatusEnum } from '@/users/enums/user-status.enum';

export interface IUserDataCreation {
  name: string;
  email: string;
  password: string;
}

export interface IUserDataUpdate {
  id: number;
  name?: string;
  status?: UserStatusEnum;
}

export interface IUserDataRemoving {
  id: number;
  password: string;
}

export interface IGetUserFilterOptions {
  id?: number;
  name?: string;
  email?: string;
  status?: UserStatusEnum;
}
