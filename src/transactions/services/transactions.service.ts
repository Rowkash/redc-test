import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import {
  TransactionEntity,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@/transactions/entities/transaction.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { UserStatusEnum } from '@/users/enums/user-status.enum';
import { CreateDepositTransactionDto } from '@/transactions/dto/create-deposit-transaction.dto';
import { CreateTransferTransactionDto } from '@/transactions/dto/create-transfer-transaction.dto';
import {
  IGetPageOptions,
  IGetTransactionsFilterOptions,
} from '@/transactions/interfaces/transaction.service.interfaces';
import { SortingDbHelper } from '@/common/helper/sorting.helper';
import { UserRolesEnum } from '@/users/enums/user-role.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private repository: Repository<TransactionEntity>,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async deposit(userId: number, payload: CreateDepositTransactionDto) {
    await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (
        !user ||
        user.status == UserStatusEnum.DISABLED ||
        user.status == UserStatusEnum.BLOCKED
      ) {
        throw new BadRequestException('User not found or not active');
      }
      user.balance = Number(user.balance) + payload.amount;

      const transaction = manager.create(TransactionEntity, {
        amount: payload.amount,
        type: TransactionTypeEnum.DEPOSIT,
        status: TransactionStatusEnum.COMPLETED,
        toUser: user,
      });

      await manager.save(user);
      await manager.save(transaction);

      await this.sendWebhook(transaction);

      return transaction;
    });
  }

  async transfer(fromUserId: number, dto: CreateTransferTransactionDto) {
    await this.dataSource.transaction(async (manager) => {
      const fromUser = await manager.findOne(UserEntity, {
        where: { id: fromUserId },
      });

      const toUser = await manager.findOne(UserEntity, {
        where: { id: dto.toUserId },
      });

      if (!fromUser || !toUser) {
        throw new NotFoundException('User not found');
      }

      if (fromUser.status == UserStatusEnum.DISABLED) {
        throw new BadRequestException(`User ${fromUser.id} is not active`);
      }
      if (toUser.status == UserStatusEnum.DISABLED) {
        throw new BadRequestException(`User ${toUser.id} is not active`);
      }
      if (fromUser.balance < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      fromUser.balance = Number(fromUser.balance) - dto.amount;
      toUser.balance = Number(toUser.balance) + dto.amount;

      const transaction = manager.create(TransactionEntity, {
        amount: dto.amount,
        type: TransactionTypeEnum.TRANSFER,
        status: TransactionStatusEnum.COMPLETED,
        fromUser,
        toUser,
      });

      await manager.save([fromUser, toUser]);
      await manager.save(transaction);

      void this.sendWebhook(transaction);

      return transaction;
    });
  }

  async cancel(transactionId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(TransactionEntity, {
        where: { id: transactionId },
        relations: ['fromUser', 'toUser'],
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (transaction.status == TransactionStatusEnum.COMPLETED) {
        throw new BadRequestException(
          'Completed transaction cannot be canceled',
        );
      }

      if (transaction.fromUser.id !== userId) {
        throw new ForbiddenException();
      }

      if (transaction.type === TransactionTypeEnum.TRANSFER) {
        const fromUser = transaction.fromUser;
        const toUser = transaction.toUser;

        if (toUser.balance < transaction.amount) {
          throw new BadRequestException(
            'Cannot cancel, insufficient user funds',
          );
        }

        toUser.balance -= transaction.amount;
        fromUser.balance += transaction.amount;

        await manager.save([fromUser, toUser]);
      }

      if (transaction.type === TransactionTypeEnum.DEPOSIT) {
        const user = transaction.toUser;

        if (user.balance < transaction.amount) {
          throw new BadRequestException('Cannot reverse deposit');
        }

        user.balance -= transaction.amount;
        await manager.save(user);
      }

      transaction.status = TransactionStatusEnum.CANCELED;
      await manager.save(transaction);

      void this.sendWebhook(transaction);

      return transaction;
    });
  }

  async getPage(options: IGetPageOptions) {
    const { limit = 20, page = 1 } = options.pageDto;
    const sorting = new SortingDbHelper<TransactionEntity>(options.pageDto);
    const filter = this.getFilter(options.role, {
      ...options.pageDto,
      currentUserId: options.currentUser,
    });

    const [models, count] = await this.repository.findAndCount({
      where: filter,
      order: sorting.orderBy,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { models, count };
  }

  private async sendWebhook(transaction: TransactionEntity) {
    const data = {
      transactionId: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      fromUserId: transaction.fromUserId,
      toUserId: transaction.toUserId,
    };
    const url = this.configService.get<string>('transactionWebhook.url')!;
    const options: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    };
    await fetch(url, options);
  }

  getFilter(
    role: UserRolesEnum,
    options: IGetTransactionsFilterOptions,
  ):
    | FindOptionsWhere<TransactionEntity>
    | FindOptionsWhere<TransactionEntity>[] {
    const filter: FindOptionsWhere<TransactionEntity> = {};

    if (options.id != null) filter.id = options.id;
    if (options.type != null) filter.type = options.type;
    if (options.status != null) filter.status = options.status;

    if (role === UserRolesEnum.ADMIN) {
      if (options.fromUserId != null) filter.fromUserId = options.fromUserId;
      if (options.toUserId != null) filter.toUserId = options.toUserId;
    }

    if (role === UserRolesEnum.CLIENT && options.currentUserId != null) {
      if (options.toUserId != null) {
        filter.fromUserId = options.fromUserId;
        filter.toUserId = options.toUserId;
      } else {
        return [
          { ...filter, fromUserId: options.currentUserId },
          { ...filter, toUserId: options.currentUserId },
        ];
      }
    }

    return filter;
  }
}
