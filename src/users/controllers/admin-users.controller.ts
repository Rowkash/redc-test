import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import type { ICustomRequest } from '@/common/interfaces/custom-request.interface';
import { UserEntity } from '@/users/entities/user.entity';
import { UsersService } from '@/users/services/users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AdminUserPageDto } from '@/users/dto/admin-users-page.dto';
import { RolesGuard } from '@/auth/guards/ roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { AdminUpdateUserDto } from '@/users/dto/admin-update-user.dto';

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user by id',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getOne({ id });

    return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Get users page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return users page',
    schema: {
      type: 'object',
      properties: {
        models: {
          type: 'array',
          items: { $ref: getSchemaPath(UserEntity) },
        },
        count: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getPage(@Query() query: AdminUserPageDto) {
    const { models, count } = await this.usersService.getPage(query);
    return {
      models: plainToInstance(UserEntity, models, {
        excludeExtraneousValues: true,
      }),
      count,
    };
  }

  @ApiOperation({ summary: 'Update user status' })
  @ApiNoContentResponse({ description: 'Update user status' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Req() { user }: ICustomRequest,
    @Body() dto: AdminUpdateUserDto,
  ) {
    const { id } = user;
    await this.usersService.update({ id, ...dto });
  }
}
