import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServiceOffer } from '../service-offers/service-offer.entity';
import { Transaction } from '../transactions/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'phone', unique: true })
  phone: string;

  @ApiProperty()
  @Column({ name: 'password' })
  password: string;

  @ApiProperty()
  @Column({ name: 'name' })
  name: string;

  @ApiProperty()
  @Column({ name: 'location', nullable: true })
  location: string;

  @ApiProperty({ default: 100 })
  @Column({ name: 'points_balance', default: 100 })
  pointsBalance: number;

  @ApiProperty({ enum: AccountType })
  @Column({
    name: 'account_type',
    type: 'enum',
    enum: AccountType,
    default: AccountType.FREE,
  })
  accountType: AccountType;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ServiceOffer, (offer) => offer.provider)
  offers: ServiceOffer[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  outgoingTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  incomingTransactions: Transaction[];
}
