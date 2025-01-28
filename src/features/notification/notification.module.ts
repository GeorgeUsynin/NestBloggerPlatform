import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailAdapter } from './email.adapter';
import { EmailManager } from './email.manager';
import { EMAIL_SERVICE } from '../../constants';

@Module({
  imports: [
    // Using forRootAsync for proper environment variables loading
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_BLOG_PLATFORM,
            pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
          },
        },
        defaults: {
          from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
        },
      }),
    }),
  ],
  providers: [EmailAdapter, EmailManager],
  exports: [EmailManager],
})
export class NotificationsModule {}
