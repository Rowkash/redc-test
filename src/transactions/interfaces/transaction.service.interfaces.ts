import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@/transactions/entities/transaction.entity';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { ClientTransactionPageDto } from '@/transactions/dto/client-transaction-page.dto';
import { AdminTransactionPageDto } from '@/transactions/dto/admin-transaction-page.dto';

export interface IGetTransactionsFilterOptions {
  id?: number;
  currentUserId?: number;
  fromUserId?: number;
  toUserId?: number;
  type?: TransactionTypeEnum;
  status?: TransactionStatusEnum;
}

export type TTransactionPageDto = ClientTransactionPageDto &
  AdminTransactionPageDto;

export interface IGetPageOptions {
  currentUser?: number;
  role: UserRolesEnum;
  pageDto: TTransactionPageDto;
}
