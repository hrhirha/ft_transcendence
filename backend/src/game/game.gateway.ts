import { Server, Socket } from 'socket.io';
import { 
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { ArgumentMetadata, HttpException, UsePipes, ValidationPipe } from '@nestjs/common';

export class WsValidationPipe extends ValidationPipe
{
    async transform(value: any, metadata: ArgumentMetadata) {
        try
        {
            return await super.transform(value, metadata);
        }
        catch (e)
        {
            if (e instanceof HttpException)
            {
                console.log({error: e.message});
                throw new WsException(e.message);
            }
        }
    }
}


@UsePipes(WsValidationPipe)
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
        if (!this.beforeStart(client))
            client.disconnect();
    
    }

    @SubscribeMessage('restart')
    restart(client: Socket, data: any): void
    {
        if (client.data.is_player)
        {
            console.log("client want to restart !!");
            // this.server.to(client.id).emit('restart');
        }
        else
        {

        }
    }

    @SubscribeMessage('endGame')
    EndGame(client: Socket, data: any): void
    {
        if (client.data.is_player)
        {
            console.log(data);
            console.log('End game ');
            this.server.to(client.id).emit('restart');
        }
        else
        {

        }
    }

    @SubscribeMessage('move')
    checkConnection(client: Socket, data: any): void
    {
        try
        {
            client.broadcast.to(data.roomid).emit('recv', data);
        }
        catch(e)
        {
            throw new WsException("Check Connection expection!! ");
        }
    }

    async beforeStart(client: Socket)
    {
        const user =  (await this.jwt.getUserFromSocket(client));
        if (!user)
        return null
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
                    id: true,
                }
            });
            this.roomCreated += 1;
            client.join(this.connection.id);
            client.data.is_player = true;

            client.emit("saveData", {
                player: "player1",
                is_player: true,
                roomId: this.connection.id
            });
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
        client.data.is_player = true;
        client.emit("saveData", {
            player: "player2",
            is_player: true,
            roomId: this.connection.id
        });
        this.server.to(this.connection.id).emit('startGame', this.connection.id);
        this.roomCreated = 0;
        return true;
    }
}
