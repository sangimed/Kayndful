import { PartialType } from '@nestjs/swagger';
import { CreateServiceOfferDto } from './create-service-offer.dto';

export class UpdateServiceOfferDto extends PartialType(CreateServiceOfferDto) {}
