import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import type { ICustomRequest } from '@/common/interfaces/custom-request.interface';
import { TransactionsService } from '@/transactions/services/transactions.service';
import { CreateTransferTransactionDto } from '@/transactions/dto/create-transfer-transaction.dto';
import { CreateDepositTransactionDto } from '@/transactions/dto/create-deposit-transaction.dto';
import { ClientTransactionPageDto } from '@/transactions/dto/client-transaction-page.dto';
import { plainToInstance } from 'class-transformer';
import { TransactionEntity } from '@/transactions/entities/transaction.entity';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { RolesGuard } from '@/auth/guards/ roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Client Transactions')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.CLIENT)
@Controller('client/transactions')
export class ClientTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Deposit', description: 'Increase user balance' })
  @Post('deposit')
  deposit(
    @Req() { user }: ICustomRequest,
    @Body() payload: CreateDepositTransactionDto,
  ) {
    return this.transactionsService.deposit(user.id, payload);
  }

  @ApiOperation({
    summary: 'Transfer',
    description: 'Transfer funds to another user',
  })
  @Post('transfer')
  transfer(
    @Req() { user }: ICustomRequest,
    @Body() payload: CreateTransferTransactionDto,
  ) {
    return this.transactionsService.transfer(user.id, payload);
  }

  @ApiOperation({ summary: 'Get transactions page' })
  @Get()
  async getPage(
    @Req() { user }: ICustomRequest,
    @Query() query: ClientTransactionPageDto,
  ) {
    const { models, count } = await this.transactionsService.getPage({
      role: UserRolesEnum.CLIENT,
      pageDto: query,
      currentUser: user.id,
    });
    return {
      models: plainToInstance(TransactionEntity, models, {
        excludeExtraneousValues: true,
      }),
      count,
    };
  }
}
