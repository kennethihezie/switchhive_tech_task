// data-source.ts
import { Product } from 'src/modules/products/model/entity/product.entity';
import { User } from 'src/modules/users/model/entity/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Product], // add your entities here
  migrations: ['src/migrations/*.ts'],
});