import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ChatModule, PrismaModule],
  controllers: [GameController],
  providers: [GameGateway, GameService],
})
export class GameModule {}
