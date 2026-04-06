import { registerAs } from '@nestjs/config';

export default registerAs('transactionWebhook', () => ({
  url: process.env.TRANSACTION_WEBHOOK_URL!,
}));
