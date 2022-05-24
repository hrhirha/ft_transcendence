import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ChatModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
