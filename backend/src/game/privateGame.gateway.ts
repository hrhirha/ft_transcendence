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
@WebSocketGateway({ cors: true, namespace: 'privateGame'})
export class PrivateGameGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server : Server;
    que: {
        Socket: Socket,
        userId: string,
    } = null;
    
    tab = new Map;
    constructor(private prisma: PrismaService, private jwt: ChatService){}
    
    async handleDisconnect(client: Socket)
    {
        console.log('Client Disconnect with ID: ' + client.id);

        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)  
            return user;
        
        if (client.data.obj == undefined)
            return ;

        if (client.data.obj.isPlayer)
        {
            if (!this.tab[client.data.obj.roomId].endGame)
            {
                await this.prisma.userGame.update({
                    data: {
                        score: (client.data.obj.player == "player1") ? client.data.obj.rScore : client.data.obj.lScore,
                        user: {         
                            update: {  
                                score: {
                                    increment: (client.data.obj.player  == "player1") ? client.data.obj.rScore :  client.data.obj.lScore,
                                },
                                wins: {
                                    increment: ((client.data.obj.player == "player1" && client.data.obj.rScore == 10) ||
                                                (client.data.obj.player == "player2" && client.data.obj.lScore == 10)) ? 1 : 0,
                                },
                                loses: {
                                    increment: ((client.data.obj.player == "player1" && client.data.obj.rScore != 10) ||
                                                (client.data.obj.player == "player2" && client.data.obj.lScore != 10)) ? 1 : 0,
                                }  
                            },
                        }
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
        
    @SubscribeMessage('createGame')
    async createGame(client: Socket, usrId: string)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        console.log("herrreee");
        var soc: any = (await this.server.fetchSockets()).filter((s) => {
            if (s.data.usrId == usrId)
                return s;
        });
        if (!soc.length)
        {
            client.disconnect();
            return ;
        }
        this.start(soc[0], client);
    }

    @SubscribeMessage('getId')
    async getId(client: Socket)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.emit("test", user.id);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log('Client Connected with ID: ' + client.id);
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }

        console.log(user.id);
        client.data.usrId = user.id;

 
        // if (client.data.obj) /// it's a watcher !! 
        //     return ;
    }

    @SubscribeMessage('restart')
    async restart(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        
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
    }

    @SubscribeMessage('endGame')
    async EndGame(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        if (client.data.obj.isPlayer)
        {
            this.tab[d.roomId].endGame = true;
            await this.prisma.userGame.update({
                
                data: {
                    score: (d.player == "player1") ? d.rscore :  d.lscore,
                    user: {         
                        update: {  
                            score: {
                                increment: (d.player == "player1") ? d.rscore :  d.lscore,
                            },
                            wins: {
                                increment: ((d.player == "player1" && d.rscore == 10) ||
                                            (d.player == "player2" && d.lscore == 10)) ? 1 : 0,
                            },
                            loses: {
                                increment: ((d.player == "player1" && d.rscore != 10) ||
                                            (d.player == "player2" && d.lscore != 10)) ? 1 : 0,
                            }  
                        },
                    }
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
            return ;
        }
        client.emit("watcherEndMatch"); /// a watcher leave the room 
    }

    @SubscribeMessage('sendToWatcher')
    async brodToWatchers(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        this.server.to(d.roomId).emit('Watchers', d);
    }

    @SubscribeMessage('join')
    async joinNewRoom(client: Socket, d: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.data.obj.roomId = d.newRoom;
        client.leave(d.oldData.roomId);
        client.join(d.newRoom);
        client.emit("restartGame");
    }

    @SubscribeMessage('watcher')
    async newWatcher(client: Socket, roomId: string)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.data.obj = {
            roomId,
            isPlayer: false,
        };
        client.join(roomId);
        client.emit("saveData", {
            roomId,
            player: "",
            is_player: false,
            userId: user.id
        });
    }


    insertSocketData(client: Socket, player: string, gameId: string )
    {
        if (player == "player1")
        {
            this.tab[gameId] = {
                user1:
                {
                    usrId: client.data.usrId,
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
            this.tab[gameId].user2.usrId = client.data.usrId;
        client.join(gameId);
        client.data.obj = {
            player,
            usrId: client.data.usrId,
            lScore: 0,
            rScore: 0,
            roomId: gameId,
            isPlayer: true,
        };

        client.emit("saveData", {
            player,
            is_player: true,
            roomId: gameId,
            usrId: client.data.usrId,
        });
    }

    @SubscribeMessage('move')
    async checkConnection(client: Socket, data: any)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.data.obj.lScore = data.lScore;
        client.data.obj.rScore = data.rScore;
        client.broadcast.to(data.roomId).emit('recv', data);
    }

    async start(client1: Socket, client2: Socket)
    {
        let connection =  await this.prisma.game.create({
            data: {
                map: "map_url",
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: client1.data.usrId },
                            { uid: client2.data.usrId  }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        console.log("Room Id = " + connection.id);
        this.insertSocketData(client1, "player1", connection.id);
        this.insertSocketData(client2, "player2", connection.id);
        this.server.to(connection.id).emit('startGame');
    }
}
