import { IsNumber, IsOptional } from 'class-validator';

import { ClientTransactionPageDto } from '@/transactions/dto/client-transaction-page.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AdminTransactionPageDto extends ClientTransactionPageDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'From user id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fromUserId?: number;
}
