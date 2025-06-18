import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { UsersModule } from '../users/users.module';
import { ServiceOffersModule } from '../service-offers/service-offers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule, ServiceOffersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
