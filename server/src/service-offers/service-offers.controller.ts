import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, SerializeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ServiceOffersService } from './service-offers.service';
import { CreateServiceOfferDto } from './dto/create-service-offer.dto';
import { UpdateServiceOfferDto } from './dto/update-service-offer.dto';
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
  create(@Body() dto: CreateServiceOfferDto, @Req() req: any) {
    return this.offersService.create(dto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceOfferDto) {
    return this.offersService.update(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
