import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOffersService } from './service-offers.service';
import { ServiceOffersController } from './service-offers.controller';
import { ServiceOffer } from './service-offer.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOffer]), UsersModule],
  controllers: [ServiceOffersController],
  providers: [ServiceOffersService],
  exports: [ServiceOffersService],
})
export class ServiceOffersModule {}
