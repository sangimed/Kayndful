import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  serviceId: number;

  @ApiProperty()
  @IsNumber()
  toUserId: number;

  @ApiProperty()
  @IsNumber()
  points: number;
}
