import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatusEnum } from '@/users/enums/user-status.enum';

export enum AdminUpdateUserEnum {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export class AdminUpdateUserDto {
  @ApiProperty({
    enum: AdminUpdateUserEnum,
    description: 'User status',
  })
  @IsOptional()
  @IsEnum(AdminUpdateUserEnum)
  readonly status?: UserStatusEnum;
}
