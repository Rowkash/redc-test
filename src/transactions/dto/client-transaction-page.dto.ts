import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { PageDto } from '@/common/dto/page.dto';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@/transactions/entities/transaction.entity';
import { Type } from 'class-transformer';

export enum TransactionsPageSortByEnum {
  CREATED_AT = 'createdAt',
}

export class ClientTransactionPageDto extends PageDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'To user id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  toUserId?: number;

  @ApiPropertyOptional({
    enum: TransactionTypeEnum,
    description: 'Transaction type',
  })
  @IsOptional()
  @IsEnum(TransactionTypeEnum)
  readonly type?: TransactionTypeEnum;

  @ApiPropertyOptional({
    enum: TransactionStatusEnum,
    description: 'Transaction status',
  })
  @IsOptional()
  @IsEnum(TransactionStatusEnum)
  readonly status?: TransactionStatusEnum;

  @ApiPropertyOptional({
    enum: TransactionsPageSortByEnum,
    default: TransactionsPageSortByEnum.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(TransactionsPageSortByEnum)
  readonly sortBy?: TransactionsPageSortByEnum =
    TransactionsPageSortByEnum.CREATED_AT;
}
