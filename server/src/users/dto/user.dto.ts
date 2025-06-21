import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty()
  pointsBalance: number;

  @ApiProperty({ enum: AccountType })
  accountType: AccountType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
