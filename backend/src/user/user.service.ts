import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { friend_status, HOST, PORT, relation_status } from 'src/utils';
import { EditFullNameDto, EditUsernameDto } from './dto';

@Injectable()
export class UserService {

    constructor(private _prismaS: PrismaService) {}

    // User

    private _getFriendRelation(me: User, friend: any)
    {
        const sent = friend.sentReq.length === 1 ? friend.sentReq[0] : null;
        const rcvd = friend.recievedReq.length === 1 ? friend.recievedReq[0] : null;

        if (me.id === friend.id) return null;
        if (!sent && !rcvd) return relation_status.NONE;
        if (sent)
        {
            if (sent.status === friend_status.ACCEPTED) return relation_status.FRIEND;
            if (sent.status === friend_status.PENDING) return relation_status.REQUESTED;
        }
        if (rcvd)
        {
            if (rcvd.status === friend_status.ACCEPTED) return relation_status.FRIEND;
            if (rcvd.status === friend_status.PENDING) return relation_status.PENDING;
        }
        return relation_status.BLOCKED;
    }

    async getAll(user: User)
    {
        const arr = await this._prismaS.user.findMany({
            where : {
                id: { not: user.id },
                AND: [
                    {
                        sentReq: {
                            none: { rcv_id: user.id, status: friend_status.BLOCKED }
                        }
                    },
                    {
                        recievedReq: {
                            none: { snd_id: user.id, status: friend_status.BLOCKED }
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                imageUrl: true,
                score: true,
                rank: {
                    select: {
                        title: true,
                        icon: true,
                        field: true,
                    }
                },
                wins: true,
                loses: true,
                status: true,
                // sentReq: {
                //     where: {
                //         rcv_id: user.id
                //     },
                //     select: { status: true, }
                // },
                // recievedReq: {
                //     where: {
                //         snd_id: user.id
                //     },
                //     select: { status: true, }
                // },
            }
        });
        if (arr.length === 0)
            throw new ForbiddenException('no users were found');

        // arr.forEach(u => {
        //     u["relation"] = this._getFriendRelation(user, u);
        //     delete u.sentReq && delete u.recievedReq;
        // });
        return arr;
    }

    async getUserById(user: User, id: string)
    {
        const u = await this._prismaS.user.findUnique({
            where: { id, },
            select: {
                id: true,
                username: true,
                fullName: true,
                imageUrl: true,
                score: true,
                rank: {
                    select: {
                        title: true,
                        icon: true,
                        field: true,
                    }
                },
                wins: true,
                loses: true,
                status: true,
                sentReq: {
                    where: {
                        rcv_id: user.id
                    },
                    select: { status: true, }
                },
                recievedReq: {
                    where: {
                        snd_id: user.id
                    },
                    select: { status: true, }
                },
            }
        });
        if (!u)
            throw new ForbiddenException('user not found');

        u["relation"] = this._getFriendRelation(user, u);
        delete u.sentReq && delete u.recievedReq;
        
        return u;
    }

    async getUserByUsername(user: User, username: string)
    {
        const u = await this._prismaS.user.findUnique({
            where: { username, },
            select: {
                id: true,
                username: true,
                fullName: true,
                imageUrl: true,
                score: true,
                rank: {
                    select: {
                        title: true,
                        icon: true,
                        field: true,
                    }
                },
                wins: true,
                loses: true,
                status: true,
                sentReq: {
                    where: {
                        OR: [{ snd_id: user.id }, { rcv_id: user.id }]
                    },
                    select: { status: true, }
                },
                recievedReq: {
                    where: {
                        OR: [{ snd_id: user.id }, { rcv_id: user.id }]
                    },
                    select: { status: true, }
                },
            }
        });
        if (!u)
            throw new ForbiddenException('user not found');

        u["relation"] = this._getFriendRelation(user, u);
        delete u.sentReq && delete u.recievedReq;
        
        return u;
    }

    async getRank(id: string)
    {
        return await this._prismaS.rank.findUnique({
            where: { id },
            select: {
                title: true,
                icon: true,
                field: true,
            }
        });
    }

    async updateStatus(id:string, status: string)
    {
        const user = await this._prismaS.user.update({
            where: {id},
            data: {status}
        });
        return user;
    }

    async enable2fa(id: string)
    {
        const u = await this._prismaS.user.update({
            where: { id },
            data: { isTfaEnabled: true }
        });
        return { success: true };
    }

    async disable2fa(id: string)
    {        
        const u = await this._prismaS.user.update({
            where: { id },
            data: { isTfaEnabled: false }
        });
        return { success: true }
    }

    async setTwoFactorAuthSecret(id: string, secret: string)
    {
        const u = await this._prismaS.user.update({
            data: {
                tfaSecret: secret,
            },
            where: {
                id_isTfaEnabled: {
                    id,
                    isTfaEnabled: false,
                },
            }
        });
        return u;
    }

    // Edit user
    async editUsername(id: string, dto: EditUsernameDto)
    {
        const user = await this._prismaS.user.update({
            where: { id },
            data: {
                username: dto.username
            },
        });

        return {success: true};
    }

    async editFullName(id: string, dto: EditFullNameDto)
    {
        const user = await this._prismaS.user.update({
            where: { id },
            data: {
                fullName: dto.fullName
            },
        });

        return {success: true};
    }

    async editAvatar(id: string, file: any)
    {
        const user = await this._prismaS.user.update({
            where: { id },
            data: {
                imageUrl: `http://${HOST}:${PORT}/${file.path}`
            },
        });
        return {success: true};
    }

    // friend Requests
    async sendFriendReq(snd_id: string, rcv_id: string)
    {
        const send = await this._prismaS.friendReq.upsert({
            where: {
                snd_id_rcv_id: {
                    snd_id: rcv_id,
                    rcv_id: snd_id
                }
            },
            update: {},
            create: {
                snd_id,
                rcv_id,
                status: friend_status.PENDING,
            },
            select: {
                receiver: { select: { id: true, } },
            }
        });
        if (send.receiver.id === snd_id)
            throw new ForbiddenException('friend request already in place');
        return { success: true };
    }

    async acceptFriendReq(snd_id: string, rcv_id: string)
    {
        const u = await this._prismaS.user.update({
            data: {
                recievedReq: {
                    updateMany: {
                        where: {
                            snd_id,
                            rcv_id,
                            status: friend_status.PENDING,
                        },
                        data: {
                            status: friend_status.ACCEPTED,
                        }
                    }
                },
            },
            where: {
                id: rcv_id
            },
            select: {
                recievedReq: {
                    where: { snd_id, rcv_id },
                }
            }
        });
        if (u.recievedReq.length === 0)
            throw new ForbiddenException('request not found');
        return { success: true };
    }

    async cancelFriendReq(snd_id: string, rcv_id: string)
    {
        const del = await this._prismaS.friendReq.deleteMany({
            where: {
                snd_id, rcv_id, status: friend_status.PENDING,
            },
        });
        if (del.count === 0)
            throw new ForbiddenException('request not found');
        return { success: true };
    }


    async sentReqs(id: string) {
        const freqs =  await this._prismaS.friendReq.findMany({
            where: {
                snd_id: id,
                AND: {
                    status: friend_status.PENDING,
                },
            },
            select: {
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        let users = [];
        for (let req of freqs)
        {
            users.push(req.receiver);
        }
        return users;
    }

    async receivedReqs(id: string) {
        const freqs = await this._prismaS.friendReq.findMany({
            where: {
                rcv_id: id,
                AND: {
                    status: friend_status.PENDING,
                },
            },
            select: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        let users = [];
        for (let req of freqs)
        {
            users.push(req.sender);
        }
        return users;
    }

    // Friends
    async unfriend(snd_id: string, rcv_id: string)
    {
        const del = await this._prismaS.friendReq.deleteMany({
            where: {
                OR: [
                    {snd_id, rcv_id},
                    {snd_id: rcv_id, rcv_id: snd_id}
                ],
                status: friend_status.ACCEPTED
            }
        });
        if (del.count === 0)
            throw new ForbiddenException('no friend was found');
        return { success: true };
    }

    async block(snd_id: string, rcv_id: string)
    {
        const bl = await this._prismaS.friendReq.updateMany({
            data: {
                snd_id,
                rcv_id,
                status: friend_status.BLOCKED,
            },
            where : {
                OR: [
                    { snd_id, rcv_id },
                    { snd_id: rcv_id, rcv_id: snd_id, }
                ],
                status: friend_status.ACCEPTED,
            }
        });
        if (bl.count === 0)
            throw new ForbiddenException('record not found');

        const ur = await this._prismaS.user.update({
            data: {
                user_rooms: {
                    updateMany: {
                        where: {
                            uid: rcv_id,
                        },
                        data: {}
                    }
                }
            },
            where: {
                id: rcv_id
            }
        });
        return { success: true }
    }

    async unblock(snd_id: string, rcv_id: string)
    {
        const bl = await this._prismaS.friendReq.updateMany({
            data: {
                status: friend_status.ACCEPTED,
            },
            where : {
                snd_id,
                rcv_id,
                status: friend_status.BLOCKED,
            }
        });
        if (bl.count === 0)
            throw new ForbiddenException('record not found');
        return { success: true };
    }


    async getFriends(id: string) {
        const freqs = await this._prismaS.friendReq.findMany({
            where: {
                OR: [
                    {snd_id: id,},
                    {rcv_id: id},
                ],
                status: friend_status.ACCEPTED
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                status: true,
                sender: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        let friends = [];
        for (let req of freqs)
        {
            const friend = req.sender.id === id ? req.receiver : req.sender;
            const status = req.status;
            friends.push(friend);
        }
        return friends;
    }

    async getBlockedFriends(id: string) {
        const freqs = await this._prismaS.friendReq.findMany({
            where: {
                snd_id: id,
                status: friend_status.BLOCKED,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                status: true,
                sender: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        let friends = [];
        for (let req of freqs)
        {
            const friend = req.sender.id === id ? req.receiver : req.sender;
            const status = req.status;
            friends.push(friend);
        }
        return friends;
    }
}
