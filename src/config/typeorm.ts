import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { setTimeout } from 'timers';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: parseInt(process.env.DATABASE_PORT),
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/../data/migrations/*.{js,ts}'],
  autoLoadEntities: true,
  logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
  ssl: process.env.NODE_ENV === 'local' ? false : true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

const logger = new Logger('TypeORM');

connectionSource
  .initialize()
  .then(() => {
    setTimeout(() => {
      logger.log(
        `DB: Connected to ${config.database} with username ${config.username}`,
      );
    }, 2500);
  })
  .catch((error) => logger.error(`DB: ${error}`));
