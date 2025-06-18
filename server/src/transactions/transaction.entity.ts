import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ServiceOffer } from '../service-offers/service-offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'transactions' })
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @ApiProperty()
  @ManyToOne(() => ServiceOffer)
  @JoinColumn({ name: 'service_id' })
  service: ServiceOffer;

  @ApiProperty()
  @Column('int', { name: 'points' })
  points: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
