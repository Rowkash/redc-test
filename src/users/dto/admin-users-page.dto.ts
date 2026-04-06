import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PageDto } from '@/common/dto/page.dto';
import { UserStatusEnum } from '@/users/enums/user-status.enum';

export enum UsersPageSortByEnum {
  CREATED_AT = 'createdAt',
}

export class AdminUserPageDto extends PageDto {
  @ApiPropertyOptional({
    enum: UserStatusEnum,
    description: 'User status',
  })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  readonly status?: UserStatusEnum;

  @ApiPropertyOptional({
    enum: UsersPageSortByEnum,
    default: UsersPageSortByEnum.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(UsersPageSortByEnum)
  readonly sortBy?: UsersPageSortByEnum = UsersPageSortByEnum.CREATED_AT;
}
