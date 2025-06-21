import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ServiceOfferDto } from '../../service-offers/dto/service-offer.dto';

export class TransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => UserDto })
  fromUser: UserDto;

  @ApiProperty({ type: () => UserDto })
  toUser: UserDto;

  @ApiProperty({ type: () => ServiceOfferDto })
  service: ServiceOfferDto;

  @ApiProperty()
  points: number;

  @ApiProperty()
  timestamp: Date;
}
