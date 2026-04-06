import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '@/configs/app.config';
import authConfig from '@/configs/auth.config';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import typeormConfig from '@/configs/typeorm.config';
import { DatabasesModule } from '@/database/databases.module';
import { TransactionsModule } from './transactions/transactions.module';
import transactionWebhookConfig from '@/configs/transaction-webhook.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env', '.development.env'],
      envFilePath: ['.development.env'],
      load: [appConfig, typeormConfig, authConfig, transactionWebhookConfig],
    }),
    AuthModule,
    DatabasesModule,
    UsersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
