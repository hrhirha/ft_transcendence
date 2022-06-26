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
import { User } from '@prisma/client';

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
    tab = new Map;
    roomCreated: number = 0;
    connection: any;
    que: {
        user: {
            Socket: Socket,
            userId: string,
        }
    } = null;
 
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
    async restart(client: Socket, d: any)
    {
        if (client.data.is_player)
        {
            this.tab[d.roomId] = {
                player1: (d.player === "player1") ? d.userId : this.tab[d.roomId]?.player1,
                player2: (d.player === "player2") ? d.userId : this.tab[d.roomId]?.player2,
            }
            if (this.tab[d.roomId]?.player1 && this.tab[d.roomId]?.player2)
            {
                const newid  = await this.prisma.game.create({
                    data: {
                        map: "map_url",
                        user_game:
                        {
                            createMany: {
                                data:
                                [
                                    { uid: this.tab[d.roomId].player1 },
                                    { uid: this.tab[d.roomId].player2 }
                                ]
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                });
                this.server.to(d.roomId).emit("newRoom", newid.id);
            }
        }
        else
        {

        }
    }

    @SubscribeMessage('endGame')
    async EndGame(client: Socket, d: any)
    {
        if (client.data.is_player)
        {
            await this.prisma.userGame.update({
                data: {
                    score: (d.player == "player1") ? d.rscore :  d.lscore,
                },
                where: {
                    uid_gid: {
                        uid: d.userId,
                        gid: d.roomId
                    }
                }
            });
            /// emit restart 
            client.emit('restart', d.status);
        }
        else
        {
            // watcher !! 
        }
    }

    @SubscribeMessage('join')
    joinNewRoom(client: Socket, d: any)
    {
        client.leave(d.oldData.roomId);
        client.join(d.newRoom);
        client.emit("restartGame");
    }

    @SubscribeMessage('watcher')
    newWatcher(client: Socket, roomid: string)
    {
        
    }

    insertSocketData(client: Socket, usrId: string, player: string)
    {
        client.join(this.connection.id);
        client.data.obj = {
            roomId: this.connection.id,
            isPlayer: true,
        };
        client.emit("saveData", {
            player,
            is_player: true,
            roomId: this.connection.id,
            userId: usrId
        });
    }

    @SubscribeMessage('move')
    checkConnection(client: Socket, data: any): void
    {
        client.broadcast.to(data.roomid).emit('recv', data);
    }

    async beforeStart(client: Socket)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null

        //  user1 save info /////////////////////
        if (!this.que)
        {
            this.que.user = {
                Socket: client,
                userId: user.id
            };
            return ;
        }
        /////////////////////////////////////////

        this.connection =  await this.prisma.game.create({
            data: {
                map: "map_url",
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: user.id              },
                            { uid: this.que.user.userId }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.que.user.Socket, this.que.user.userId, "player1");
        this.insertSocketData(client, user.id, "player2");
        this.server.to(this.connection.id).emit('startGame');
        return true;
    }
}
