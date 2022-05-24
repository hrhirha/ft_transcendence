import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ChatGateway, ChatService, UserService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
