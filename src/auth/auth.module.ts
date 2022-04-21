import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth42Strategy } from './strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, OAuth42Strategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
