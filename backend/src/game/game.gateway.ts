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
    que: {
        Socket: Socket,
        userId: string,
    } = null;
    
    tab = new Map;
    // {
    //     user1: {
    //         usrId: string,
    //         restart: boolean,
    //         disconected: boolean
    //     },
    //     user2: {
    //         usrId: string,
    //         restart: boolean,
    //         disconected: boolean
    //     },
    //     endGame: boolean,
    // }
    
    constructor(private prisma: PrismaService, private jwt: ChatService){}
    async handleDisconnect(client: Socket)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        console.log('Client Disconnect with ID: ' + client.id);
        
        if (client.data.obj == undefined)
        {
            this.que = (client == this.que.Socket) ? null : this.que;
            return ;
        }

        if (client.data.obj.isPlayer)
        {
            if (!this.tab[client.data.obj.roomId].endGame)
            {
                console.log("save data");
                await this.prisma.userGame.update({
                    data: {
                        score: (client.data.obj.player == "player1") ? client.data.obj.rScore : client.data.obj.lScore,
                    },
                    where: {
                        uid_gid: {
                            uid: client.data.obj.usrId,
                            gid: client.data.obj.roomId
                        }
                    }
                });
            }
            this.server.to(client.data.obj.roomId).emit("leave");
        }
        else
            client.leave(client.data.obj.roomId); /// a watcher leave the room 
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log('Client Connected with ID: ' + client.id);
        if (!this.beforeStart(client))
            client.disconnect();
    }

    @SubscribeMessage('restart')
    async restart(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        
        if (client.data.obj.isPlayer)
        {
            this.tab[d.roomId].user1.restart = (d.player === "player1") ? 
            true: this.tab[d.roomId].user1.restart;
            this.tab[d.roomId].user2.restart = (d.player === "player2") ?
            true: this.tab[d.roomId].user2.restart;
            
            if (this.tab[d.roomId].user1.restart && this.tab[d.roomId].user2.restart)
            {
                const newid  = await this.prisma.game.create({
                    data: {
                        map: "map_url",
                        user_game:
                        {
                            createMany: {
                                data:
                                [
                                    { uid: this.tab[d.roomId].user1.usrId },
                                    { uid: this.tab[d.roomId].user2.usrId }
                                ]
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                });
                
                this.tab[d.roomId].user1.restart = false;
                this.tab[d.roomId].user2.restart = false;
                this.tab[d.roomId].endGame = false;
                
                this.tab[newid.id] = this.tab[d.roomId];
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
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        if (client.data.obj.isPlayer)
        {
            this.tab[d.roomId].endGame = true;
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
    async joinNewRoom(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        client.data.obj.roomId = d.newRoom;
        client.leave(d.oldData.roomId);
        client.join(d.newRoom);
        client.emit("restartGame");
    }

    @SubscribeMessage('watcher')
    async newWatcher(client: Socket, roomid: string)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        client.data.obj = {
            roomId: roomid,
            isPlayer: false,
        };
        client.join(roomid);

    }

    insertSocketData(client: Socket, usrId: string, player: string)
    {
        if (player == "player1")
        {
            this.tab[this.connection.id] = {
                user1:
                {
                    usrId,
                    restart: false,
                    disconected: false
                },
                user2:
                {
                    usrId: undefined,
                    restart: false,
                    disconected: false
                },
                endGame: false
            }
        }
        else
            this.tab[this.connection.id].user2.usrId = usrId;
        client.join(this.connection.id);
        client.data.obj = {
            player,
            usrId,
            lScore: 0,
            rScore: 0,
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
    async checkConnection(client: Socket, data: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return null
        client.data.obj.lScore = data.lScore;
        client.data.obj.rScore = data.rScore;
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
            this.que = {
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
                            { uid: this.que.userId }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.que.Socket, this.que.userId, "player1");
        this.insertSocketData(client, user.id, "player2");
        this.que = null;
        this.server.to(this.connection.id).emit('startGame');
        return true;
    }
}
