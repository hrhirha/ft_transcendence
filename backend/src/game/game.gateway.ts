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

    normaleQue: {
        soc: Socket,
        userId: string,
    } = null;

    ultimateQue: {
        soc: Socket,
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
        {
            client.emit("leave");
            this.ultimateQue = (this.ultimateQue && client == this.ultimateQue.soc) ? null : this.ultimateQue;
            this.normaleQue = (this.normaleQue && client == this.normaleQue.soc) ? null : this.normaleQue;
            return ;
        }

        if (client.data.obj.isPlayer)
        {
            if (!this.tab[client.data.obj.roomId].endGame)
            {
                this.prisma.$transaction(async () => {
                    const ranks = await this.prisma.rank.findMany({ select: { id: true, require: true, } });
    
                    const u = (await this.prisma.userGame.update({
                        data: {
                            score: (client.data.obj.player == "player1") ? client.data.obj.rScore : client.data.obj.lScore,
                            user: {         
                                update: {  
                                    score: {
                                        increment: (client.data.obj.player  == "player1") ? client.data.obj.rScore :  client.data.obj.lScore,
                                    },
                                    wins: {
                                        increment: ((client.data.obj.player == "player1" && client.data.obj.rScore == client.data.bestOf) ||
                                                    (client.data.obj.player == "player2" && client.data.obj.lScore == client.data.bestOf)) ? 1 : 0,
                                    },
                                    loses: {
                                        increment: ((client.data.obj.player == "player1" && client.data.obj.rScore != client.data.bestOf) ||
                                                    (client.data.obj.player == "player2" && client.data.obj.lScore != client.data.bestOf)) ? 1 : 0,
                                    }  
                                },
                            }
                        },
                        where: {
                            uid_gid: {
                                uid: client.data.obj.usrId,
                                gid: client.data.obj.roomId
                            }
                        },
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    score: true,
                                }
                            }
                        }
                    })).user;
    
                    const u_rank = (ranks.filter(r => { u.score >= r.require }));
    
                    if (u_rank.length !== 0)
                    {
                        await this.prisma.user.update({
                            where: { id: u.id },
                            data: {
                                rank_id: u_rank[u_rank.length - 1].id
                            }
                        });
                    }
                })
            }
            this.server.to(client.data.obj.roomId).emit("leave");
        }
        else
            client.leave(client.data.obj.roomId); /// a watcher leave the room 
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log('Client Connected with ID: ' + client.id);
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
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
            this.prisma.$transaction(async () => {
                const ranks = await this.prisma.rank.findMany({ select: { id: true, require: true, } });
                const u = (await this.prisma.userGame.update({ 
                    data: {
                        score: (d.player == "player1") ? d.rscore :  d.lscore,
                        user: {         
                            update: {  
                                score: {
                                    increment: (d.player == "player1") ? d.rscore :  d.lscore,
                                },
                                wins: {
                                    increment: ((d.player == "player1" && d.rscore == client.data.bestOf) ||
                                                (d.player == "player2" && d.lscore == client.data.bestOf)) ? 1 : 0,
                                },
                                loses: {
                                    increment: ((d.player == "player1" && d.rscore != client.data.bestOf) ||
                                                (d.player == "player2" && d.lscore != client.data.bestOf)) ? 1 : 0,
                                }  
                            },
                        }
                    },
                    where: {
                        uid_gid: {
                            uid: d.userId,
                            gid: d.roomId
                        }
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                score: true,
                            }
                        }
                    }
                })).user;

                const u_rank = (ranks.filter(r => { u.score >= r.require }));

                if (u_rank.length !== 0)
                {
                    await this.prisma.user.update({
                        where: { id: u.id },
                        data: {
                            rank_id: u_rank[u_rank.length - 1].id
                        }
                    });
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

    @SubscribeMessage('normaleQue')
    async normaleQuee(client: Socket)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.data.bestOf = 5;
        //  user1 save info /////////////////////
        if (!this.normaleQue)
        {
            this.normaleQue = {
                soc: client,
                userId: user.id
            };           
            client.emit("waiting");
            return this.normaleQue;
        }
        if (this.normaleQue.soc == client)
            return this.normaleQue;
        /////////////////////////////////////////

        let connection =  await this.prisma.game.create({
            data: {
                map: "map_url",
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: user.id    },
                            { uid: this.normaleQue.userId }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.normaleQue.soc, this.normaleQue.userId, "player1", connection.id);
        this.insertSocketData(client, user.id, "player2", connection.id);
        this.server.to(connection.id).emit('startGame');
        this.normaleQue = null;

    }

    @SubscribeMessage('ultimateQue')
    async ultimateQuee(client: Socket)
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        client.data.bestOf = 3;
        //  user1 save info /////////////////////
        if (!this.ultimateQue)
        {
            this.ultimateQue = {
                soc: client,
                userId: user.id
            };
            client.emit("waiting");
            return this.ultimateQue;
        }
        /////////////////////////////////////////

        let connection =  await this.prisma.game.create({
            data: {
                map: "map_url",
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: user.id    },
                            { uid: this.ultimateQue.userId }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.ultimateQue.soc, this.ultimateQue.userId, "player1", connection.id);
        this.insertSocketData(client, user.id, "player2", connection.id);
        this.server.to(connection.id).emit('startGame');
        this.ultimateQue = null;
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

    insertSocketData(client: Socket, usrId: string, player: string, room: string)
    {
        if (player == "player1")
        {
            this.tab[room] = {
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
            this.tab[room].user2.usrId = usrId;
        client.join(room);
        client.data.obj = {
            player,
            usrId,
            lScore: 0,
            rScore: 0,
            roomId: room,
            isPlayer: true,
        };
        client.emit("saveData", {
            player,
            is_player: true,
            roomId: room,
            userId: usrId
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
        if (!client.data.obj)
        {
            console.log(client.data.obj);

        }
        client.data.obj.lScore = data.lScore;
        client.data.obj.rScore = data.rScore;
        client.broadcast.to(data.roomId).emit('recv', data);
    }

}
