import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { TransactionEntity } from '@/transactions/entities/transaction.entity';
import { TransactionsService } from '@/transactions/services/transactions.service';
import { AdminTransactionPageDto } from '@/transactions/dto/admin-transaction-page.dto';
import { RolesGuard } from '@/auth/guards/ roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Admin Transactions')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.ADMIN)
@Controller('client/transactions')
export class ClientTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Get transactions page' })
  @Get()
  async getPage(@Query() query: AdminTransactionPageDto) {
    const { models, count } = await this.transactionsService.getPage({
      role: UserRolesEnum.CLIENT,
      pageDto: query,
    });
    return {
      models: plainToInstance(TransactionEntity, models, {
        excludeExtraneousValues: true,
      }),
      count,
    };
  }
}
