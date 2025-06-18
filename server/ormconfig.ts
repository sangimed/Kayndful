import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { ServiceOffer } from './src/service-offers/service-offer.entity';
import { Transaction } from './src/transactions/transaction.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'kayndful',
  entities: [User, ServiceOffer, Transaction],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
