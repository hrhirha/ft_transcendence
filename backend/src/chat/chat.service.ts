import { ForbiddenException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Room, User, UserRoom } from '@prisma/client';
import * as argon2 from 'argon2'
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserIdDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { friend_status, room_type } from 'src/utils';
import { AddMessageDto, DeleteMessageDto, MuteUserDto, NewRoomDto, OldRoomDto, UserRoomDto } from './dto';

@Injectable()
export class ChatService {
    constructor (
        private _prismaS: PrismaService,
        private _userS: UserService,
        private _authS: AuthService
        ) {}

    async createRoom(user: User, room: NewRoomDto)
    {
        // hash password for PROTECTED Room
        if (room.type === room_type.PROTECTED)
        {
            if (!room.password)
                throw new WsException('protected room requires a password');
            
            room.password = await argon2.hash(room.password);
        }
        
        const r = await this._prismaS.room.create({
            data: {
                name: room.name,
                type: room.type,
                password: room.password,
                is_channel: true,
                user_rooms: {
                    create: {
                        uid: user.id,
                        is_owner: true,
                        is_admin: true,
                    },
                }
            },
            select: {
                id: true,
                is_channel: true,
                name: true,
                type: true,
            }
        });

        for (let uid of room.uids)
        {
            await this._prismaS.userRoom.create({
                data: {
                    uid,
                    rid: r.id
                }
            });
        }
        
        return r;
    }
    
    async deleteRoom(user: User, room: OldRoomDto)
    {
        const del = await this._prismaS.room.deleteMany({
            where: {
                id: room.id,
                user_rooms: {
                    some: {
                        uid: user.id,
                        rid: room.id,
                        is_owner: true
                    }
                },
            },
        });
        return {success: del.count === 0 ? false: true};
    }

    async start_dm(u1: User, u2: UserIdDto)
    {
        const re = await this._prismaS.room.findMany({
            where: {
                AND: [
                    {
                        user_rooms: {
                            some: { uid: u1.id, }
                        }
                    },
                    {
                        user_rooms: {
                            some: { uid: u2.id }
                        }
                    }
                ]
            },
            select: {
                id: true,
                is_channel: true,
            }
        });
        if (re.length === 1)
            return re[0];

        const r = await this._prismaS.room.create({
            data: {
                name: '',
                type: room_type.PRIVATE,
                is_channel: false,
                user_rooms: {
                    createMany: {
                        data: [
                            {
                                uid: u1.id,
                                is_owner: true,
                                is_admin: true,
                            },
                            {
                                uid: u2.id,
                                is_owner: true,
                                is_admin: true,
                            }
                        ]
                    }
                }
            },
            select: {
                id: true,
                is_channel: true,
            }
        });
        return r;
    }
                
    async joinRoom(user: User, room: OldRoomDto)
    {
        let r = await this._getRoom(room.id);
        if (!r)
            throw new WsException('room not found');
        if (r.type === room_type.PRIVATE)
            throw new WsException('you can\'t join a private room');
        if (r.type === room_type.PROTECTED)
        {
            if (!room.password)
                throw new WsException('protected room requires a password');
            if (!(await argon2.verify(r.password, room.password)))
                throw new WsException('invalid password');
        }

        return await this._prismaS.room.update({
            where: { id: room.id },
            data: {
                user_rooms: {
                    create: { uid: user.id, },
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
            }
        });
    }

    async leaveRoom(user: User, room: OldRoomDto)
    {
        return await this._prismaS.room.update({
            where: { id: room.id },
            data: {
                user_rooms: {
                    delete: {
                        uid_rid: {
                            uid: user.id,
                            rid: room.id,
                        }
                    },
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
            }
        });
    }

    async addUser(user: User, member: UserRoomDto)
    {
        const our = await this._prismaS.userRoom.findMany({
            where: {
                uid: user.id,
                rid: member.rid,
                is_owner: true
            },
            select: {
                uid: true,
                rid: true,
            }
        });
        if (our.length === 0)
            throw new WsException('room not found | you are not the owner');

        const ur = await this._prismaS.userRoom.create({
            data: {
                uid: member.uid,
                rid: member.rid,
                is_owner: false,
                is_admin: false,
                is_banned: false,
                is_muted: false,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        return ur.user;
    }

    async removeUser(user: User, member: UserRoomDto)
    {
        const our = await this._prismaS.userRoom.findMany({
            where: {
                uid: user.id,
                rid: member.rid,
                is_owner: true
            },
            select: {
                uid: true,
                rid: true,
            }
        });
        if (our.length === 0)
            throw new WsException('room not found | you are not the owner');

        const ur = await this._prismaS.userRoom.delete({
            where: {
                uid_rid: { ...member }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                    }
                }
            }
        });
        return ur.user;
    }

    async addAdmin(user: User, user_room: UserRoomDto)
    {
        const ur = await this._prismaS.userRoom.updateMany({
            data: { is_admin: true, },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_admin: false,
                room: {
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_owner: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new ForbiddenException('addAdmin failed');
        return {success: true}
    }

    async removeAdmin(user: User, user_room: UserRoomDto)
    {
        const ur = await this._prismaS.userRoom.updateMany({
            data: { is_admin: false, },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_admin: true,
                room: {
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_owner: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new ForbiddenException('removeAdmin failed');
        return {success: true}
}

    async banUser(user: User, user_room: UserRoomDto)
    {
        const ur = await this._prismaS.userRoom.updateMany({
            data: {
                is_banned: true,
            },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_banned: false,
                room: {
                    is_channel: true,
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_admin: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new WsException('ban operation failed');
        return {success: true}
    }

    async unbanUser(user: User, user_room: UserRoomDto)
    {
        const ur = await this._prismaS.userRoom.updateMany({
            data: {
                is_banned: false,
            },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_banned: true,
                room: {
                    is_channel: true,
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_admin: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new WsException('unban operation failed');
        return {success: true}
    }

    async muteUser(user: User, user_room: MuteUserDto)
    {
        const unmute_at = new Date();
        unmute_at.setTime(
            unmute_at.getTime() + this._toMillis(user_room.mute_period)
        );

        const ur = await this._prismaS.userRoom.updateMany({
            data: {
                is_muted: true,
                unmute_at,
            },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_muted: false,
                room: {
                    is_channel: true,
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_admin: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new WsException('mute operation failed');

        return {success: true}
    }

    async unmuteUser(user: User, user_room: UserRoomDto)
    {
        const ur = await this._prismaS.userRoom.updateMany({
            data: {
                is_muted: false,
                unmute_at: null,
            },
            where: {
                uid: user_room.uid,
                rid: user_room.rid,
                is_muted: true,
                room: {
                    is_channel: true,
                    user_rooms: {
                        some: {
                            uid: user.id,
                            rid: user_room.rid,
                            is_admin: true,
                        }
                    }
                }
            },
        });
        if (ur.count === 0)
            throw new WsException('mute operation failed');

        return {success: true}
    }

    async sendMessage(user: User, data: AddMessageDto)
    {
        let dm_uid: string;
        const dm = await this._prismaS.userRoom.findMany({
            where: {
                rid: data.rid,
                room: { id: data.rid, is_channel: false, }
            },
            select: {
                user: { select: { id: true} }
            }
        });
        if (dm.length === 2)
            dm_uid = dm[0].user.id === user.id ? dm[1].user.id : dm[0].user.id;

        await this._isBlockedOrBanned(user.id, dm_uid, data.rid)

        return await this._addMsgToDb(user.id, data);
    }

    async deleteMessage(user: User, msg: DeleteMessageDto)
    {
        const del =  await this._prismaS.message.deleteMany({
            where: {
                id: msg.id,
                uid: user.id,
                rid: msg.rid,
            },
        });
        if (del.count === 0)
            throw new WsException('unable to delete message');
        console.log(del)
        return {success: true}
    }


    // get requests

    async getJoinedRooms(user: User)
    {
        const rooms = await this._prismaS.room.findMany({
            where: {
                // is_channel: true,
                user_rooms: {
                    some: {
                        uid : user.id,
                    }
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
                is_channel: true
            },
        });
        return rooms;
    }

    async getDms(user: User)
    {
        const rooms = await this._prismaS.room.findMany({
            where: {
                is_channel: false,
                user_rooms: {
                    some: {
                        uid : user.id,
                    }
                }
            },
            select: {
                id: true,
            },
        });
        return rooms;
    }

    async connectToServer(user: User)
    {
        const rooms = await this._prismaS.room.findMany({
            where: {
                user_rooms: {
                    some: { uid: user.id }
                }
            },
             select: {
                 id: true
             }
        });
        console.log(rooms);
    }

    async getPublicRooms()
    {
        const rooms = await this._getRoomsByType(room_type.PUBLIC);
        if (!rooms)
            throw new ForbiddenException('no public rooms found');
        return rooms;
    }

    async getProtectedRooms()
    {
        const rooms = await this._getRoomsByType(room_type.PROTECTED);
        if (!rooms)
            throw new ForbiddenException('no protected rooms found');
        return rooms;
    }

    async getRoomMembers(uid: string, rid: string)
    {
        if (!this._isMember(uid, rid))
            throw new ForbiddenException('not a member');
        const user_rooms = await this._getUserRoomsByRid(rid);
        if (!user_rooms)
            throw new ForbiddenException('no users found in this room');
        let members: User[] = [];
        for (let user_room of user_rooms)
        {
            const user = await this._userS.findById(user_room.uid);
            members.push(user);
        }
        return members;
    }

    async getRoomMessages(uid: string, rid: string)
    {
        const user_room = await this._getUserRoom(uid, rid);
        if (!user_room)
            throw new ForbiddenException('not a member');
        const messages = await this._prismaS.message.findMany({
            where: { rid, },
            orderBy:{ timestamp: 'desc', },
        });
        if (!messages)
            throw new ForbiddenException('messages not found');
        messages.filter((message) => {
            message.timestamp >= user_room.joined_time;
        });
        return messages;
    }

    // public helpers

    async getUserFromSocket(client: Socket)
    {
        const token = client?.handshake?.headers?.cookie?.split("=")[1];
        if (!token)
            return null;
        // const token = cookie?.split("=")[1];
        
        const user = await this._authS.getUserFromToken(token);
        return user;
    }

    // Private helpers

    private async _isMember(uid: string, rid: string)
    {
        return !(await this._prismaS.userRoom.findFirst({
            where: { uid, rid }
        })) ? false : true;
    }

    private async _getRoom(id: string) {
        return await this._prismaS.room.findUnique({
            where: { id }
        });
    }

    private async _getUserRoom(uid: string, rid: string)
    {
        if (!(await this._getRoom(rid)))
            throw new ForbiddenException('room not found');
        if (!(await this._userS.findById(uid)))
            throw new ForbiddenException('user not found');
        return await this._prismaS.userRoom.findUnique({
            where: { uid_rid: {
                uid,
                rid
            } }
        });
    }

    private async _getUserRoomsByUid(uid: string)
    {
        return await this._prismaS.userRoom.findMany({
            where: { uid }
        });
    }

    private async _getUserRoomsByRid(rid: string)
    {
        return await this._prismaS.userRoom.findMany({
            where: { rid }
        });
    }

    private async _getRoomsByType(type: string)
    {
        return await this._prismaS.room.findMany({
            where: {
                type
            }
        });
    }

    private _toMillis(t: string) {
        if (t === 'inf')
            return 64757577600000; //01/01/4022
        const id = t[t.length-1];
        const time = Number(t.substring(0, t.length-1))

        let ms = time * 1000 * 60;
        if (id === 'H')
            ms *= 60;
        return ms;
    }

    private async _isBlockedOrBanned(uid1: string, uid2: string, rid: string)
    {
        const ur = await this._prismaS.userRoom.findMany({
            where: {
                uid: uid1, rid,
                OR: [
                    { is_banned: true, },
                    {
                        room: { id: rid, is_channel: false, },
                        user: {
                            id: uid1,
                            OR: [
                                {
                                    recievedReq: {
                                        some: {
                                            snd_id: uid2, rcv_id: uid1,
                                            status: friend_status.BLOCKED,
                                        }
                                    }
                                },
                                {
                                    sentReq: {
                                        some: {
                                            snd_id: uid1, rcv_id: uid2,
                                            status: friend_status.BLOCKED,
                                        }
                                    }
                                }
                            ]
                        }
                    }   
                ]
            },
            select: {
                is_banned: true,
            }
        });
        if (ur.length === 1)
        {
            throw new WsException(ur[0].is_banned ? 'banned' : 'blocked');
        }
        return true;
    }

    private async _addMsgToDb(uid: string, data: AddMessageDto)
    {
        const r = await this._prismaS.room.update({
            data: {
                messages: {
                    create : { uid, msg: data.msg, }
                },
                user_rooms: {
                    updateMany: {
                        data: {
                            is_muted: false,
                            unmute_at: null,
                        },
                        where: {
                            uid,
                            rid: data.rid,
                            is_muted: true,
                            unmute_at: { lte: new Date, }
                        }
                    }
                }
            },
            where: { id: data.rid },
            select: {
                user_rooms: {
                    where:{
                        uid, rid: data.rid,
                        OR: [
                            {
                                AND: [
                                    { is_muted : true },
                                    { unmute_at: { lte: new Date() } }
                                ]
                            },
                            {
                                is_muted: false,
                            }
                        ]
                    },
                    select: {
                        uid: true,
                        rid: true,
                        is_muted: true,
                        unmute_at: true,
                    }
                },
                messages: {
                    select: {
                        id: true,
                        msg: true,
                        timestamp: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                            },
                        }
                    },
                    orderBy: { timestamp: 'asc' }
                }
            }
        });

        if (r.user_rooms.length === 0)
            throw new WsException('you are not a memeber or have been muted');
            
        return r.messages[r.messages.length-1];
    }
}
