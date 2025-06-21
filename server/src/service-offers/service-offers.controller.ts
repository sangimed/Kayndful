import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, SerializeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ServiceOffersService } from './service-offers.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
import { ServiceOfferDto } from './dto/service-offer.dto';
import { toServiceOfferDto } from '../utils/mappers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('offers')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: `User is not authorized` })
@SerializeOptions({
    excludeExtraneousValues: true,
})
@Controller('offers')
export class ServiceOffersController {
  constructor(private readonly offersService: ServiceOffersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateServiceOfferDto, @Req() req: any): Promise<ServiceOfferDto> {
    const offer = await this.offersService.create(dto, req.user.userId);
    return toServiceOfferDto(offer);
  }

  @Get()
  async findAll(): Promise<ServiceOfferDto[]> {
    const offers = await this.offersService.findAll();
    return offers.map(toServiceOfferDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceOfferDto> {
    const offer = await this.offersService.findOne(+id);
    return toServiceOfferDto(offer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateServiceOfferDto): Promise<ServiceOfferDto> {
    const offer = await this.offersService.update(+id, dto);
    return toServiceOfferDto(offer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.offersService.remove(+id);
  }
}
