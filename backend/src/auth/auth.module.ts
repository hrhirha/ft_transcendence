import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy, OAuth42Strategy } from './strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Jwt2FAAuthStrategy } from './strategy/jwt-2fa-auth.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({}), forwardRef(() => UserModule)],
  providers: [AuthService, OAuth42Strategy, JwtStrategy, Jwt2FAAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
