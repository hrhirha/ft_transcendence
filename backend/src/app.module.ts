import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal: true
            }),
            MulterModule.register({}),
            AuthModule,
            UserModule,
            PrismaModule,
            TwoFactorAuthModule,
            ChatModule,
          ],
})
export class AppModule {}
