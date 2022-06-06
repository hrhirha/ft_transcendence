import { Server, Socket } from 'socket.io';
import { 
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse 
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';

@UseGuards(Jwt2FAAuthGuard)
@WebSocketGateway({ cors: true, namespace: 'game'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server : Server;
 
    roomCreated: number = 0;
    connection: any;
 
    constructor(private prisma: PrismaService, private jwt: ChatService){}
     handleDisconnect(client: Socket) {
       console.log('Client Disconnect with ID: ' + client.id);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log('Client Connected with ID: ' + client.id);
        this.beforeStart(client);
    }

    @SubscribeMessage('server')
    checkConnection(client: Socket, text: string) : WsResponse<string>
    {
        return {
            event: 'FromTheServerToClient', data: text
        };
        // this.server.emit('game', msg);
    }

    async beforeStart(client: Socket)
    {
        const user = (await this.jwt.getUserFromSocket(client));
        if (!this.roomCreated)
        {
            this.connection =  await this.prisma.game.create({
                data: {
                    map: "map_url",
                    user_game:
                    {
                        create: {
                            uid: user.id,
                            is_player: true,
                            score: 0
                        }
                    }
                },
                select: {
                    _count: true,
                    id: true
                }
            });
            this.roomCreated += 1;
            client.join(this.connection.id);
            return false;
        }
        await this.prisma.userGame.create({
            data: {
                uid: user.id,
                is_player: true,
                score: 0,
                gid: this.connection.id,
            },
        });
        client.join(this.connection.id);
        this.server.to(this.connection.id).emit('startGame', this.connection.id);
        this.roomCreated = 0;
        return true;
    }
}
