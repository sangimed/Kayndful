import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServiceOffersModule } from './service-offers/service-offers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/user.entity';
import { ServiceOffer } from './service-offers/service-offer.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'kayndful',
      entities: [User, ServiceOffer, Transaction],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServiceOffersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
