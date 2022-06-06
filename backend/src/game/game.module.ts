import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [ChatModule, PrismaModule],
  controllers: [],
  providers: [GameGateway],
})
export class GameModule {}
