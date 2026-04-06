import { UserRolesEnum } from '@/users/enums/user-role.enum';

export interface IJwtData {
  userId: number;
  email: string;
  roles: UserRolesEnum[];
}
