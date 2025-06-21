import { Injectable, BadRequestException } from '@nestjs/common';
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

  async create(dto: CreateTransactionDto, fromUserId: number): Promise<Transaction> {
    const [fromUser, toUser, service] = await Promise.all([
      this.usersService.findOne(fromUserId),
      this.usersService.findOne(dto.toUserId),
      this.offersService.findOne(dto.serviceId),
    ]);
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

  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({ relations: ['fromUser', 'toUser', 'service'] });
  }
}
