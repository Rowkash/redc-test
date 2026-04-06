import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateTransferTransactionDto {
  @ApiProperty({ example: 1, description: 'User id' })
  @IsNumber()
  toUserId: number;

  @ApiProperty({ example: 50, description: 'Transfer amount' })
  @IsNumber()
  @Min(1)
  amount: number;
}
