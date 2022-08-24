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
        user: any,
    } = null;

    ultimateQue: {
        soc: Socket,
        user: any,
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
            this.ultimateQue = (this.ultimateQue && client.id === this.ultimateQue.user.id) ? null : this.ultimateQue;
            this.normaleQue = (this.normaleQue && client.id === this.normaleQue.user.id) ? null : this.normaleQue;
            return ;
        }

        if (client.data.obj.isPlayer)
        {
            if (!this.tab[client.data.obj.roomId].endGame)
            {
                try
                {
                let factor = (client.data.bestOf == 5) ? { facWin: 5, losFac: 2 } : { facWin: 15, losFac: 5};
                let winner = ((client.data.obj.player == "player1" && client.data.obj.lScore == client.data.bestOf)
                || (client.data.obj.player == "player2" && client.data.obj.rScore == client.data.bestOf)) ? factor.facWin : factor.losFac;
                this.prisma.$transaction(async () => {
                    const ranks = await this.prisma.rank.findMany({ select: { id: true, require: true, } });
    
                    const u = (await this.prisma.userGame.update({
                        data: {
                            score: (client.data.obj.player == "player1") ? client.data.obj.rScore : client.data.obj.lScore,
                            user: {         
                                update: {  
                                    score: {
                                        increment: (client.data.obj.player  == "player1") ? client.data.obj.rScore * winner :  client.data.obj.lScore * winner,
                                    },
                                    wins: {
                                        increment: ((client.data.obj.player == "player1" && client.data.obj.lScore == client.data.bestOf) ||
                                                    (client.data.obj.player == "player2" && client.data.obj.rScore == client.data.bestOf)) ? 1 : 0,
                                    },
                                    loses: {
                                        increment: ((client.data.obj.player == "player1" && client.data.obj.lScore != client.data.bestOf) ||
                                                    (client.data.obj.player == "player2" && client.data.obj.rScore != client.data.bestOf)) ? 1 : 0,
                                    }  
                                },
                            },
                            // added by hrhirha
                            game: {
                                update: {
                                    ongoing: false,
                                }
                            }
                            // end
                        },
                        where: {
                            uid_gid: {
                                uid: client.data.obj.userId,
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
    
                    const u_rank = (ranks.filter(r => u.score >= r.require ));
                    console.log(u_rank.length);
    
                    if (u_rank.length !== 0)
                    {
                        await this.prisma.user.update({
                            where: { id: u.id },
                            data: {
                                // rank: { connect: {id: u_rank[u_rank.length - 1].id }}
                                rank_id: u_rank[u_rank.length - 1].id
                            }
                        }); 
                    }
                })
                }
                catch
                {
                    console.log("handleDisconnect Prisma Failed !!");
                }
            }
            this.server.to(client.data.obj.roomId).emit("youWin");
            this.server.to(client.data.obj.roomId).emit("leaveTheGame"); // to all watcher leave the game when on of player left the game !! -- for aimad
        }
        else
        {
            this.tab[client.data.obj.roomId].vues -= 1,
            this.server.to(client.data.obj.roomId).emit("vues", this.tab[client.data.obj.roomId].vues);
            client.leave(client.data.obj.roomId); /// a watcher leave the room 
        }
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
                        map: this.tab[d.roomId].mapUrl,
                        user_game:
                        {
                            createMany: {
                                data:
                                [
                                    { uid: this.tab[d.roomId].user1.userId },
                                    { uid: this.tab[d.roomId].user2.userId }
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
        if (client.data.obj && client.data.obj.isPlayer)
        {
            try
            {
                let factor = (client.data.bestOf == 5) ? { facWin: 5, losFac: 2 } : { facWin: 15, losFac: 5};
                let winner = ((d.player == "player1" && d.lscore == client.data.bestOf) || (d.player == "player2" && d.rscore == client.data.bestOf)) ? factor.facWin : factor.losFac;
                this.tab[d.roomId].endGame = true;
                this.prisma.$transaction(async () => {
                    const ranks = await this.prisma.rank.findMany({ select: { id: true, require: true, } });
                    const u = (await this.prisma.userGame.update({ 
                        data: {
                            score: (d.player == "player1") ? d.rscore :  d.lscore,
                            user: {
                                update: {  
                                    score: {
                                        increment: (d.player == "player1") ? d.rscore * winner :  d.lscore * winner,
                                    },
                                    wins: {
                                        increment: ((d.player == "player1" && d.lscore == client.data.bestOf) ||
                                                    (d.player == "player2" && d.rscore == client.data.bestOf)) ? 1 : 0,
                                    },
                                    loses: {
                                        increment: ((d.player == "player1" && d.lscore != client.data.bestOf) ||
                                                    (d.player == "player2" && d.rscore != client.data.bestOf)) ? 1 : 0,
                                    }  
                                },
                            },
                            // added by hrhirha
                            game: {
                                update: {
                                    ongoing: false,
                                }
                            }
                            // end
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

                    const u_rank = (ranks.filter(r =>  u.score >= r.require ));

                    if (u_rank.length !== 0)
                    {
                        await this.prisma.user.update({
                            where: { id: u.id },
                            data: {
                                // rank: { connect: {id: u_rank[u_rank.length - 1].id }}
                                rank_id: u_rank[u_rank.length - 1].id
                            }
                        });
                    }
                });
                /// emit restart 
                let win = (d.rscore === client.data.bestOf) ? this.tab[d.roomId].user2.userId: this.tab[d.roomId].user1.userId;
                this.server.to(d.roomId).emit("matchWinner", win); /// a watcher leave the room  -- for aimad
                client.emit('restart', d.status);
                return ;
            }
            catch
            {
                console.log(d);
            }
        }
        client.emit("watcherEndMatch");

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
        if (client.data.obj && client.data.obj.player === "player1" && (client.data.obj.lScore != d.lScore || client.data.obj.rScore != d.rScore))
        {
            this.server.to(client.data.obj.roomId).emit("updateScore", {
                score1: d.lScore,
                score2: d.rScore,
            });
        }
        if (client.data.obj)
        {
            client.data.obj.lScore = d.lScore;
            client.data.obj.rScore = d.rScore;
        }
        if (!d.newEmit)
            this.server.to(d.roomId).emit('Watchers', d);
    }

    @SubscribeMessage('normaleQue')
    async normaleQuee(client: Socket, obj: {
        private: boolean,
        userId: string
    })
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        if (client.data.obj)
            client.leave(client.data.obj.roomId);

        client.data.bestOf = 5;
        if (obj.private)
        {
            this.privateGame(client, "normaleQue", user, obj.userId);
            return ;
        }
        //  user1 save info /////////////////////
        if (!this.normaleQue || this.normaleQue.user.id == user.id)
        {
            if (this.normaleQue && this.normaleQue.user.id == user.id)
                this.normaleQue.soc.disconnect();
            this.normaleQue = {
                soc: client,
                user: user,
            };           
            client.emit("waiting", {
                p1: user,
                p2: null, 
            });
            return this.normaleQue;
        }

        client.emit("joined", {
            p1: this.normaleQue.user,
            p2: user, 
        });

        this.normaleQue.soc.emit("joined", {
            p1: this.normaleQue.user,
            p2: user, 
        });
        /////////////////////////////////////////
        let connection =  await this.prisma.game.create({
            data: {
                map: "normalField",
                is_ultimate: false,
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: this.normaleQue.user.id },
                            { uid: user.id }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.normaleQue.soc, this.normaleQue.user, "player1", connection.id, "normalField");
        this.insertSocketData(client, user, "player2", connection.id, "normalField");
        this.normaleQue = null;
        this.server.to(connection.id).emit('startGame');

    }

    @SubscribeMessage('ultimateQue')
    async ultimateQuee(client: Socket, obj: {
        private: boolean,
        userId: string
    })
    {
        const user =(await this.jwt.getUserFromSocket(client));
        if (!user)
        {
            client.disconnect();
            return user;
        }
        if (client.data.obj)
            client.leave(client.data.obj.roomId);
        client.data.bestOf = 3;

        if (obj.private)
        {
            this.privateGame(client, "ultimateQue", user, obj.userId);
            return ;
        }
        
        //  user1 save info /////////////////////
        if (!this.ultimateQue || this.ultimateQue.user.id == user.id)
        {
            if (this.ultimateQue && this.ultimateQue.user.id == user.id)
                this.ultimateQue.soc.disconnect();
            this.ultimateQue = {
                soc: client,
                user: user,
            };
            client.emit("waiting", {
                p1: user,
                p2: null, 
            });
            return this.ultimateQue;
        }
        /////////////////////////////////////////

        client.emit("joined", {
            p1: this.ultimateQue.user,
            p2: user, 
        });
        this.ultimateQue.soc.emit("joined", {
            p1: this.ultimateQue.user,
            p2: user, 
        });

        const mapUrl: string = (this.ultimateQue.user.score > user.score) ? this.ultimateQue.user.rank.field: user.rank.field;
        let connection =  await this.prisma.game.create({
            data: {
                map: mapUrl,
                is_ultimate: true,
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: this.ultimateQue.user.id },
                            { uid: user.id    }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(this.ultimateQue.soc, this.ultimateQue.user, "player1", connection.id, mapUrl);
        this.insertSocketData(client, user, "player2", connection.id, mapUrl);
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
        this.server.to(client.data.obj.roomId).emit("updateScore", {
            score1: 0,
            score2: 0,
        });
        client.data.obj.roomId = d.newRoom;
        client.leave(d.oldData.roomId);
        client.join(d.newRoom);
        client.emit("keepWatching"); // keep watching emit to the front end to remove the Winner panel -- aimad
        client.emit("restartGame");
    }

    async privateGame (client: Socket, type: string, newUser: any , userId: string )
    {
        /////////////////////////////////////////
        var soc: any = (await this.server.fetchSockets()).filter((s) => {
            if (s.data.usrId == userId)
                return s;
        });
        if (!soc.length)
        {
            client.emit("waiting", {
                p1: newUser,
                p2: null,
            });
            return ;
        }

        const user =(await this.jwt.getUserFromSocket(soc[0]));
        client.emit("joined", {
            p1: user,
            p2: newUser,
        });
        soc[0].emit("joined", {
            p1: user,
            p2: newUser, 
        });

        
        let mapUrl: string = (user.score > newUser.score) ? user.rank.field: newUser.rank.field;
        mapUrl = (type === "ultimateQue") ? mapUrl: "normalField" ;
        let connection =  await this.prisma.game.create({
            data: {
                map: mapUrl,
                is_ultimate: (type === "ultimateQue") ? true: false,
                user_game:
                {
                    createMany: {
                        data:
                        [
                            { uid: user.id },
                            { uid: newUser.id    }
                        ]
                    }
                }
            },
            select: {
                id: true,
            }
        });
        this.insertSocketData(soc[0], user, "player1", connection.id, mapUrl);
        this.insertSocketData(client, user, "player2", connection.id, mapUrl);
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
        this.tab[roomId].vues += 1;
        
        console.log(this.tab[roomId].mapUrl);
        client.data.obj = {
            roomId,
            isPlayer: false,
            bestOf: (this.tab[roomId].mapUrl === "normalField") ? 5 : 3,
        };
        client.emit("saveData", {
            roomId,
            player: "",
            is_player: false,
            userId: user.id,
            mapUrl: this.tab[roomId].mapUrl,
        });        
        
        client.emit("joinStream", {
            p1: this.tab[roomId].user1.user,
            p2: this.tab[roomId].user2.user,
            score1: this.tab[roomId].user1.client.data.obj.lScore,
            score2: this.tab[roomId].user1.client.data.obj.rScore,
        });
        client.join(roomId);
        this.server.to(client.data.obj.roomId).emit("vues", this.tab[client.data.obj.roomId].vues); // -- vues for the watcher !!! 
    }

    insertSocketData(client: Socket, usr: any, player: string, room: string, mapUrl: string)
    {
        if (player == "player1")
        {
            this.tab[room] = {
                user1:
                {
                    client,
                    user: usr,
                    userId: usr.id,
                    restart: false,
                    disconected: false
                },
                user2:
                {
                    user: undefined,
                    userId: undefined,
                    restart: false,
                    disconected: false
                },
                endGame: false,
                mapUrl,
                vues: 0,
            }
        }
        else
        {
            this.tab[room].user2.user = usr;
            this.tab[room].user2.userId = usr.id;
        }
        client.data.obj = {
            player,
            userId: usr.id,
            lScore: 0,
            rScore: 0,
            roomId: room,
            isPlayer: true,
        };
        client.emit("saveData", {
            player,
            is_player: true,
            roomId: room,
            userId: usr.id,
            mapUrl,
        });
        client.join(room);
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
            return ;
        client.broadcast.to(data.roomId).emit('recv', data);
    }
}
