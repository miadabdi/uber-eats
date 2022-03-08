import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

export interface IUser {
  email: string;
  name: string;
}

@Injectable()
export class MailService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  async sendConfirmEmail(user: IUser, url: string): Promise<true> {
    // FIXME: fix this
    // set default for email cause we can't send emails to unverified emails in free plan
    const defaultMail = 'miadabdi80@gmail.com';

    await this.mailerService.sendMail({
      to: defaultMail, // user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Uber Eats! Confirm your Email',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });

    return true;
  }
}
