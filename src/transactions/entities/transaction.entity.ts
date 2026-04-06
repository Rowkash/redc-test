import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/common/entities/base.entity';
import { UserEntity } from '@/users/entities/user.entity';

export enum TransactionStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}
export enum TransactionTypeEnum {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @ApiProperty({
    example: 100,
    description: 'Amount',
  })
  @Expose()
  @Column('decimal')
  amount: number;

  @ApiProperty({
    example: TransactionTypeEnum.DEPOSIT,
    enum: TransactionTypeEnum,
    description: 'Transaction type',
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: Object.values(TransactionTypeEnum),
  })
  type: TransactionTypeEnum;

  @ApiProperty({
    example: TransactionStatusEnum.COMPLETED,
    enum: TransactionTypeEnum,
    description: 'Transaction status',
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: Object.values(TransactionStatusEnum),
    default: TransactionStatusEnum.PENDING,
  })
  status: TransactionStatusEnum;

  @ApiProperty({
    example: 1,
    description: 'From user id',
  })
  @Expose()
  @Column({ name: 'from_user_id', type: 'int', nullable: true })
  fromUserId: number | null;

  @ManyToOne(() => UserEntity, (user) => user.sentTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity;

  @ApiProperty({
    example: 1,
    description: 'To user id',
  })
  @Expose()
  @Column({ name: 'to_user_id', type: 'int' })
  toUserId: number;

  @ManyToOne(() => UserEntity, (user) => user.receivedTransactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_user_id' })
  toUser: UserEntity;
}
