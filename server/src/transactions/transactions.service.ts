import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from '../users/users.service';
import { ServiceOffersService } from '../service-offers/service-offers.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
    private offersService: ServiceOffersService,
  ) {}

  async create(dto: CreateTransactionDto, fromUserId: number) {
    const fromUser = await this.usersService.findOne(fromUserId);
    const toUser = await this.usersService.findOne(dto.toUserId);
    const service = await this.offersService.findOne(dto.serviceId);
    if (!fromUser || !toUser || !service) throw new NotFoundException();
    if (fromUser.pointsBalance < dto.points) throw new BadRequestException('Insufficient points');

    fromUser.pointsBalance -= dto.points;
    toUser.pointsBalance += dto.points;
    await this.usersService.update(fromUserId, { pointsBalance: fromUser.pointsBalance });
    await this.usersService.update(toUser.id, { pointsBalance: toUser.pointsBalance });

    const transaction = this.transactionsRepository.create({
      fromUser,
      toUser,
      service,
      points: dto.points,
    });
    return this.transactionsRepository.save(transaction);
  }

  findAll() {
    return this.transactionsRepository.find({ relations: ['fromUser', 'toUser', 'service'] });
  }
}
