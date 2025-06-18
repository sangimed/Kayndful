import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AccountType } from '../user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: AccountType, required: false })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
