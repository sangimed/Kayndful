import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreateServiceOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsNumber()
  pointCost: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  availability: boolean;
}
