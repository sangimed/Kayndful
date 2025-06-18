import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'service_offers' })
export class ServiceOffer {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'title' })
  title: string;

  @ApiProperty()
  @Column('text', { name: 'description' })
  description: string;

  @ApiProperty()
  @Column({ name: 'category' })
  category: string;

  @ApiProperty()
  @Column('int', { name: 'point_cost' })
  pointCost: number;

  @ApiProperty()
  @Column({ name: 'availability', default: true })
  availability: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
