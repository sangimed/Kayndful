import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ServiceOffer {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column('int')
  pointCost: number;

  @ApiProperty()
  @Column({ default: true })
  availability: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  provider: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
