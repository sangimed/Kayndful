import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOffer } from './service-offer.entity';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ServiceOffersService {
  constructor(
    @InjectRepository(ServiceOffer)
    private offersRepository: Repository<ServiceOffer>,
    private usersService: UsersService,
  ) {}

  create(dto: CreateServiceOfferDto, userId: number) {
    return this.usersService.findOne(userId).then((user) => {
      const offer = this.offersRepository.create({ ...dto, provider: user });
      return this.offersRepository.save(offer);
    });
  }

  findAll() {
    return this.offersRepository.find({ relations: ['provider'] });
  }

  findOne(id: number) {
    return this.offersRepository.findOne({ where: { id }, relations: ['provider'] });
  }

  async update(id: number, dto: UpdateServiceOfferDto) {
    const offer = await this.findOne(id);
    if (!offer) throw new NotFoundException();
    Object.assign(offer, dto);
    return this.offersRepository.save(offer);
  }

  async remove(id: number) {
    await this.offersRepository.delete(id);
  }
}
