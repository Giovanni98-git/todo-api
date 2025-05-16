import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { TaskModule } from './task/task.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TaskgroupModule } from './taskgroup/taskgroup.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    MailerModule,
    TaskModule,
    UploadfileModule,
    TaskgroupModule,
    MailModule,
  ],
})
export class AppModule {}
