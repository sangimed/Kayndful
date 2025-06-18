import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ServiceOffer } from '../service-offers/service-offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => User)
  fromUser: User;

  @ApiProperty()
  @ManyToOne(() => User)
  toUser: User;

  @ApiProperty()
  @ManyToOne(() => ServiceOffer)
  service: ServiceOffer;

  @ApiProperty()
  @Column('int')
  points: number;

  @ApiProperty()
  @CreateDateColumn()
  timestamp: Date;
}
