import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@/users/entities/user.entity';
import { UsersService } from '@/users/services/users.service';
import { ClientUsersController } from '@/users/controllers/client-users.controller';
import { AdminUsersController } from '@/users/controllers/admin-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AdminUsersController, ClientUsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
