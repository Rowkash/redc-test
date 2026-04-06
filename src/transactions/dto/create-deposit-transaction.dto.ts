import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateDepositTransactionDto {
  @ApiProperty({ example: 100.12, description: 'Deposit amount' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;
}
