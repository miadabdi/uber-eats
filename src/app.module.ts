import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantModule } from './restaurant/restaurant.module';
import * as joi from 'joi';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';

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
        JWT_SECRET: joi.string().required(),
        SMTP_HOST: joi.string().required(),
        SMTP_PORT: joi.number().required(),
        SMTP_USERNAME: joi.string().required(),
        SMTP_PASSWORD: joi.string().required(),
        SMTP_FROM: joi.string().required(),
        SMTP_FROM_NAME: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Restaurant, Verification],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // autoSchemaFile: true,
    }),
    RestaurantModule,
    UsersModule,
    CommonModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
