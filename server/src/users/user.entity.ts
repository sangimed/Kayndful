import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ServiceOffer } from '../service-offers/service-offer.entity';
import { Transaction } from '../transactions/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  phone: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ default: 100 })
  @Column({ default: 100 })
  pointsBalance: number;

  @ApiProperty({ enum: AccountType })
  @Column({ type: 'enum', enum: AccountType, default: AccountType.FREE })
  accountType: AccountType;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ServiceOffer, (offer) => offer.provider)
  offers: ServiceOffer[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  outgoingTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  incomingTransactions: Transaction[];
}
