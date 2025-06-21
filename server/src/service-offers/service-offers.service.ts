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

  async create(dto: CreateServiceOfferDto, userId: number): Promise<ServiceOffer> {
    const user = await this.usersService.findOne(userId);
    const offer = this.offersRepository.create({ ...dto, provider: user });
    return await this.offersRepository.save(offer);
  }

  async findAll(): Promise<ServiceOffer[]> {
    return this.offersRepository.find({ relations: ['provider'] });
  }

  async findOne(id: number): Promise<ServiceOffer> {
    const offer = await this.offersRepository.findOne({ where: { id }, relations: ['provider'] });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async update(id: number, dto: UpdateServiceOfferDto): Promise<ServiceOffer> {
    const offer = await this.findOne(id);
    Object.assign(offer, dto);
    return this.offersRepository.save(offer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.offersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Offer not found');
    }
  }
}
