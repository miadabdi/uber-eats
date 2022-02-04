import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantModule } from './restaurant/restaurant.module';
import * as joi from 'joi';
import { Restaurant } from './restaurant/entities/restaurant.entity';

let envFilePath;
if (process.env.NODE_ENV == 'development') {
  envFilePath = '.dev.env';
} else if (process.env.NODE_ENV == 'test') {
  envFilePath = '.test.env';
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      ignoreEnvFile: process.env.NODE_ENV == 'production',
      validationSchema: joi.object({
        NODE_ENV: joi
          .string()
          .valid('development', 'test', 'production')
          .required(),
        DB_HOST: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_DATABASE: joi.string().required(),
        DB_PORT: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Restaurant],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // autoSchemaFile: true,
    }),
    RestaurantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
