import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

console.log(__dirname + '/templates');

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MailerOptions => {
        return {
          transport: {
            host: configService.get<string>('SMTP_HOST'),
            port: configService.get<number>('SMTP_PORT'),
            // from: configService.get<string>('SMTP_FROM'),
            secure: false,
            auth: {
              user: configService.get<string>('SMTP_USERNAME'),
              pass: configService.get<string>('SMTP_PASSWORD'),
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"${configService.get<string>(
              'SMTP_FROM_NAME',
            )}" <${configService.get<string>('SMTP_FROM')}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
