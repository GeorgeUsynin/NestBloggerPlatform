import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailAdapter } from './email.adapter';
import { EmailManager } from './email.manager';
import { EMAIL_SERVICE } from './constants';
import { CoreConfig } from '../../core/config';

@Module({
  imports: [
    // Using forRootAsync for proper environment variables loading
    MailerModule.forRootAsync({
      useFactory: async (coreConfig: CoreConfig) => ({
        transport: {
          service: EMAIL_SERVICE,
          auth: {
            user: coreConfig.EMAIL_BLOG_PLATFORM,
            pass: coreConfig.EMAIL_BLOG_PLATFORM_PASSWORD,
          },
        },
        defaults: {
          from: `Blog Platform <${coreConfig.EMAIL_BLOG_PLATFORM}>`,
        },
      }),
      inject: [CoreConfig],
    }),
  ],
  providers: [EmailAdapter, EmailManager],
  exports: [EmailManager],
})
export class NotificationsModule {}
