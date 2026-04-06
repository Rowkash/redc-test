import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionEntity } from '@/transactions/entities/transaction.entity';
import { TransactionsService } from '@/transactions/services/transactions.service';
import { ClientTransactionsController } from '@/transactions/controllers/client-transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [ClientTransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
