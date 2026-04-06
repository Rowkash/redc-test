import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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
} from '@nestjs/swagger';

import type { ICustomRequest } from '@/common/interfaces/custom-request.interface';
import { UserEntity } from '@/users/entities/user.entity';
import { DeleteUserDto } from '@/users/dto/delete-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/ roles.guard';

@ApiTags('Client Users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.CLIENT)
@Controller('client/users')
export class ClientUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return self user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user by id',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getSelfUser(@Req() { user }: ICustomRequest) {
    const { id } = user;
    const userDoc = await this.usersService.getOne({ id });

    return plainToInstance(UserEntity, userDoc, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update self user' })
  @ApiNoContentResponse({ description: 'User updated successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('me')
  async update(@Req() { user }: ICustomRequest, @Body() dto: UpdateUserDto) {
    const { id } = user;
    await this.usersService.update({ id, ...dto });
  }

  @ApiOperation({ summary: 'Delete self user' })
  @ApiNoContentResponse({ description: 'User deleted successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async remove(
    @Req() { user }: ICustomRequest,
    @Body() { password }: DeleteUserDto,
  ) {
    const { id } = user;
    await this.usersService.remove({ id, password });
  }
}
