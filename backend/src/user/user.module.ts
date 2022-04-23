import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService,
              JwtStrategy,]
})
export class UserModule {}
