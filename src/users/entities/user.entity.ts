import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BaseEntity } from '@/common/entities/base.entity';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { UserStatusEnum } from '@/users/enums/user-status.enum';
import { TransactionEntity } from '@/transactions/entities/transaction.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Expose()
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    example: 'benfrank@protonmail.com',
    description: 'User email',
  })
  @Expose()
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    example: UserRolesEnum.CLIENT,
    enum: UserRolesEnum,
    description: 'User roles',
  })
  @Expose()
  @Column({
    type: 'enum',
    array: true,
    enum: Object.values(UserRolesEnum),
    default: [UserRolesEnum.CLIENT],
  })
  roles: UserRolesEnum[];

  @ApiProperty({
    example: UserStatusEnum.ACTIVE,
    enum: UserStatusEnum,
    description: 'User status',
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @ApiProperty({
    example: 100,
    description: 'User balance',
  })
  @Expose()
  @Column('decimal', { default: 0, precision: 12, scale: 2 })
  balance: number;

  @OneToMany(() => TransactionEntity, (tx) => tx.fromUser)
  sentTransactions: TransactionEntity[];

  @OneToMany(() => TransactionEntity, (tx) => tx.toUser)
  receivedTransactions: TransactionEntity[];
}
