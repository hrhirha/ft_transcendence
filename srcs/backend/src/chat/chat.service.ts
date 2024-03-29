import { ForbiddenException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as argon2 from 'argon2'
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChallengeDto, UserDto, UserIdDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { friend_status, msg_type, relation_status, room_type, user_status } from 'src/utils';
import { AddMessageDto, ChangePasswordDto, DeleteMessageDto, EditRoomDto, MuteUserDto, NewRoomDto, OldRoomDto, RemovePasswordDto, SetPasswordDto, UserRoomDto } from './dto';

@Injectable()
export class ChatService {
    constructor (
        private _prismaS: PrismaService,
        private _authS: AuthService,
        private _user: UserService
        ) {}

    // POST

    async createRoom(user: UserDto, room: NewRoomDto)
    {
        // hash password for PROTECTED Room
        if (room.password)
            room.password = await argon2.hash(room.password);

        const type = room.password ? room_type.PROTECTED : (room.is_private ? room_type.PRIVATE: room_type.PUBLIC);

        const ret =  await this._prismaS.$transaction(async (prisma) => {
            const r = await prisma.room.create({
                data: {
                    name: room.name,
                    type,
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
                    name: true,
                    type: true,
                    user_rooms: {
                        where: {uid: user.id},
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true
                                }
                            }
                        }
                    }
                }
            });

            let usernames: string[] = [r.user_rooms[0].user.username];
            for (let uid of room.uids)
            {
                const ur = await prisma.userRoom.create({
                    data: {
                        uid,
                        rid: r.id
                    },
                    select: {
                        user: {
                            select: {username:true}
                        }
                    }
                });
                usernames.push(ur.user.username);
            }
            r["owner"] = r?.user_rooms[0]?.user?.id;
            delete r.user_rooms;
            return {room: r, usernames};
        });
        const m = await this._add_msg_to_db(user.id, {rid: ret.room.id, msg: `${user.username} created this room`}, msg_type.NOTIF);
        return {ret, m};
    }
    
    async deleteRoom(user: UserDto, room: OldRoomDto)
    {
        const del = await this._prismaS.room.deleteMany({
            where: {
                id: room.id,
                is_channel: true,
                user_rooms: {
                    some: {
                        uid: user.id,
                        rid: room.id,
                        is_owner: true
                    }
                },
            },
        });
        if (del.count === 0)
            throw new WsException('could not delete room');
        return { id: room.id };
    }

    async setPassword(user: UserDto, dto: SetPasswordDto)
    {
        // public --> protected
        dto.new_password = await argon2.hash(dto.new_password);
        const r = await this._prismaS.room.updateMany({
            data: {
                password: dto.new_password,
                type: room_type.PROTECTED,
            },
            where: {
                id: dto.id,
                type: room_type.PUBLIC,
                user_rooms: {
                    some: {
                        uid: user.id,
                        is_owner: true,
                    },
                },
            },
        });
        if (r.count === 0)
            throw new WsException({
                error: 'FORBIDDEN',
                message: 'unable to set password, if the room exist and you are the owner, this might already be protected'
            });
        return {
            id: dto.id,
            type: room_type.PROTECTED,
        }
    }

    async changePassword(user: UserDto, dto: ChangePasswordDto)
    {
        // protected --> protected
        const room = await this._prismaS.room.findFirst({
            where: {
                id: dto.id,
                type: room_type.PROTECTED,
                user_rooms: {
                    some: {
                        uid: user.id,
                        is_owner: true,
                    },
                }
            },
        });
        if (!room)
            throw new WsException('room not found or not protected');
        if (!(await argon2.verify(room.password, dto.old_password)))
        {
            throw new WsException({code: "INVALIDPASS", message: 'invalid old_password'});
        }

        dto.new_password = await argon2.hash(dto.new_password);
        const r = await this._prismaS.room.update({
            data: {
                password: dto.new_password,
            },
            where: {
                id: dto.id,
            },
            select: {
                id: true,
            }
        });
        if (!r)
            throw new WsException({
                error: 'FORBIDDEN',
                message: 'unable to set password, if the room exist and you are the owner, this might already be protected'
            });
        return {
            id: dto.id,
            type: room_type.PROTECTED,
        }
    }

    async removePassword(user: UserDto, dto: RemovePasswordDto)
    {
        // protected --> public
        const room = await this._prismaS.room.findFirst({
            where: {
                id: dto.id,
                type: room_type.PROTECTED,
                user_rooms: {
                    some: {
                        uid: user.id,
                        is_owner: true,
                    },
                }
            },
        });
        if (!room)
            throw new WsException('room not found or not protected');
        if (!(await argon2.verify(room.password, dto.old_password)))
            throw new WsException({code: "INVALIDPASS", message: 'invalid old_password'});

        const r = await this._prismaS.room.update({
            data: {
                password: null,
                type: room_type.PUBLIC,
            },
            where: {
                id: dto.id,
            },
        });
        if (!r)
            throw new WsException({
                error: 'FORBIDDEN',
                message: 'unable to set password, if the room exist and you are the owner, this might already be protected'
            });
        return {
            id: dto.id,
            type: room_type.PUBLIC,
        }
    }

    async getUnjoinedUsers(rid: string)
    {
        const usrs = await this._prismaS.user.findMany({
            where: {
                user_rooms: {
                    none: { rid, }
                }
            },
            select: {
                username: true,
            }
        });

        const usernames = [];
        usrs.forEach((usr) => {
            usernames.push(usr.username);
        });
        return usernames;
    }

    // added is_blocked to user
    async start_dm(u1: UserDto, u2: UserIdDto)
    {
        let dm = await this._dm_exists(u1.id, u2.id);
        if (!dm)
        {
            dm = await this._prismaS.room.create({
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
                        },
                    }
                },
                select: {
                    id: true,
                    is_channel: true,
                    user_rooms: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true,
                                    imageUrl: true,
                                    status: true,
                                    sentReq: {
                                        where: {
                                            OR: [
                                                {
                                                    snd_id: u1.id,
                                                    rcv_id: u2.id,
                                                },
                                                {
                                                    snd_id: u2.id,
                                                    rcv_id: u1.id,
                                                }
                                            ]
                                        }
                                    },recievedReq: {
                                        where: {
                                            OR: [
                                                { snd_id: u1.id, },
                                                { rcv_id: u1.id, }
                                            ]
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            });
        }

        const user1 = dm.user_rooms[0].user;
        const user2 = dm.user_rooms[1].user;
        const req = user1.sentReq.length === 1 ? user1.sentReq[0]
                    : (user1.recievedReq.length === 1 ? user1.recievedReq[0] : null);
        const is_blocked = (req && req.status === friend_status.BLOCKED) ? true : false;
        // user2['is_blocked'] = (req && req.status === friend_status.BLOCKED) ? true : false;
        delete user1.sentReq && delete user1.recievedReq;
        delete user2.sentReq && delete user2.recievedReq;
        delete dm.user_rooms;
        return { room: dm, user1, user2, is_blocked };
    }

    async joinRoom(user: UserDto, room: OldRoomDto)
    {
        let r = await this._prismaS.room.findUnique({
            where: { id: room.id }
        });
        if (!r)
            throw new WsException('room not found');
        if (r.type === room_type.PRIVATE)
            throw new WsException('you can\'t join a private room');
        if (r.type === room_type.PROTECTED)
        {
            if (!room.password)
                throw new WsException({code: "NOPASS", error: 'protected room requires a password'});
            if (!(await argon2.verify(r.password, room.password)))
                throw new WsException({code: "INVALIDPASS", message: 'invalid password'});
        }

        const up_r = await this._prismaS.room.update({
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
                is_channel: true,
                user_rooms: {
                    where: {
                        uid: user.id,
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                            }
                        }
                    }
                }
            }
        });
        if (!up_r)
            throw new WsException('unable to join room');
        const msg = await this._add_msg_to_db(user.id, {rid: r.id, msg: `${user.username} joined`}, msg_type.NOTIF);
        const u = up_r.user_rooms[0].user;
        delete up_r.user_rooms;
        return { room: r, user: u , msg};
    }

    async leaveRoom(user: UserDto, room: OldRoomDto)
    {
        const ur = await this._prismaS.userRoom.deleteMany({
            where: {
                uid: user.id,
                rid: room.id,
                is_owner: false,
            },
        });

        if (ur.count === 0)
            throw new WsException('owner can not leave');
        const msg = await this._add_msg_to_db(user.id, {rid: room.id, msg: `${user.username} left`}, msg_type.NOTIF);
        return {room, msg};
    }

    async editRoom(user: UserDto, data: EditRoomDto)
    {
        const old_room = await this._is_admin(user.id, data.rid);
        
        let messages = [];
        for (let uid of data.uids)
        {
            try
            {
                const ur = await this._prismaS.userRoom.create({
                    data: {
                        uid,
                        rid: data.rid,
                    },
                    select: {
                        user: {
                            select: { username: true, }
                        }
                    }
                });
                const msg = await this._add_msg_to_db(user.id, {rid: data.rid, msg: `${user.username} added ${ur.user.username}`}, msg_type.NOTIF);
                messages.push(msg);
            }
            catch {}
        }

        const room = await this._prismaS.room.update({
            where: {
                id: data.rid,
            },
            data: {
                name: data.name,
            },
            select: {
                id: true,
                name: true,
                type: true,
                user_rooms: {
                    select: {
                        is_owner: true,
                        is_admin: true,
                        is_banned: true,
                        is_muted: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                            }
                        }
                    }
                }
            }
        });
        if (room.name !== old_room.name)
        {
            const msg = await this._add_msg_to_db(user.id, {rid: data.rid, msg: `${user.username} changed this channel's name to ${room.name}`}, msg_type.NOTIF);
            messages.push(msg);
        }
        let members = [];
        for (let ur of room.user_rooms)
        {
            ur.user['is_owner'] = ur.is_owner;
            ur.user['is_admin'] = ur.is_admin;
            ur.user['is_banned'] = ur.is_banned,
            ur.user['is_muted'] = ur.is_muted,
            members.push(ur.user);
        }
        delete room.user_rooms;

        return {...room, members, messages}
    }

    async removeUser(user: UserDto, member: UserRoomDto)
    {
        await this._is_admin(user.id, member.rid);

        const arr = await this._prismaS.userRoom.findUnique({
            where: {
                uid_rid: { ...member, }
            },
            select: {
                is_owner: true,
            }
        });
        if (arr.is_owner)
            throw new WsException({error: 'you can not remove the owner of this room'});

        const ur = await this._prismaS.userRoom.delete({
            where: {
                uid_rid: { ...member }
            },
            select: {
                room: {
                    select: { id: true, is_channel: true, }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                        status: true,
                    }
                }
            }
        });
        const msg = await this._add_msg_to_db(user.id, {rid: ur.room.id, msg: `${user.username} removed ${ur.user.username}`}, msg_type.NOTIF);
        return {ur, msg};
    }

    async addAdmin(user: UserDto, user_room: UserRoomDto)
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
            throw new WsException('addAdmin failed');
        return {success: true}
    }

    async removeAdmin(user: UserDto, user_room: UserRoomDto)
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
            throw new WsException('removeAdmin failed');
        return {success: true}
    }

    async banUser(user: UserDto, user_room: UserRoomDto)
    {
        const ur0 = await this._get_ur_if_admin(user, user_room);
        if (!ur0)
            throw new WsException('user not found | room not found | you are not an admin');
        if (ur0.is_banned)
            throw new WsException('user already banned');

        const ur = await this._prismaS.userRoom.update({
            data: {
                is_banned: true,
            },
            where: {
                uid_rid: {
                    uid: user_room.uid,
                    rid: user_room.rid,
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                        status: true,
                    }
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        is_channel: true,
                        lst_msg: true,
                        lst_msg_ts: true,
                    },
                }
            }
        });

        if (!ur)
            throw new WsException('ban operation failed');
        const msg = await this._add_msg_to_db(user.id, {rid: user_room.rid, msg: `${ur.user.username} is banned`}, msg_type.NOTIF);
        return {ur, msg}
    }

    async unbanUser(user: UserDto, user_room: UserRoomDto)
    {
        const ur0 = await this._get_ur_if_admin(user, user_room);
        if (!ur0)
            throw new WsException('user not found | room not found | you are not an admin');
        if (!ur0.is_banned)
            throw new WsException('user already unbanned');

        const ur = await this._prismaS.userRoom.update({
            data: {
                is_banned: false,
            },
            where: {
                uid_rid: {
                    uid: user_room.uid,
                    rid: user_room.rid,
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        imageUrl: true,
                        status: true,
                    }
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        is_channel: true,
                        lst_msg: true,
                        lst_msg_ts: true,
                    },
                }
            }
        });
        if (!ur)
            throw new WsException('unban operation failed');
        const msg = await this._add_msg_to_db(user.id, {rid: user_room.rid, msg: `${ur.user.username} is unbanned`}, msg_type.NOTIF);
        return {ur, msg};
    }

    async muteUser(user: UserDto, user_room: MuteUserDto)
    {
        const unmute_at = new Date();
        unmute_at.setTime(
            unmute_at.getTime() + this._to_millis(user_room.mute_period)
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
                is_banned: false,
                is_owner: false,
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

        const u = await this._user.getUserById(user, user_room.uid);
        const msg = await this._add_msg_to_db(user.id, {rid: user_room.rid, msg: `${u.username} is muted`}, msg_type.NOTIF);
        return msg;
    }

    async unmuteUser(user: UserDto, user_room: UserRoomDto)
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
                is_banned: false,
                is_owner: false,
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
        const u = await this._user.getUserById(user, user_room.uid);
        const msg = await this._add_msg_to_db(user.id, {rid: user_room.rid, msg: `${u.username} is unmuted`}, msg_type.NOTIF);
        return msg;
    }

    async sendMessage(user: UserDto, data: AddMessageDto)
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

        await this._can_send_msg(user.id, dm_uid, data.rid);
        const msg =  await this._add_msg_to_db(user.id, data);

        return msg;
    }

    async deleteMessage(user: UserDto, msg: DeleteMessageDto)
    {
        await this._prismaS.$transaction(async () => {
            const del =  await this._prismaS.message.updateMany({
                data: {
                    msg: 'this message hase been deleted',
                    type: msg_type.DEL,
                },
                where: {
                    id: msg.id,
                    uid: user.id,
                    rid: msg.rid,
                },
            });
            if (del.count === 0)
                throw new WsException('unable to delete message');
    
            const room = await this._prismaS.room.findUnique({
                where: { id: msg.rid },
            });
    
            await this._prismaS.room.updateMany({
                where: {
                    id: msg.rid,
                    messages: {
                        some: {
                            id: msg.id,
                            type: msg_type.DEL,
                            timestamp: {equals: room.lst_msg_ts}
                        }
                    }
                },
                data: {
                    lst_msg: 'this message hase been deleted',
                    lst_msg_ts: undefined,
                }
            });
        });
        return {success: true}
    }

    async getOpponent(user: UserDto, dto: ChallengeDto)
    {
        const u = await this._user.getUserById(user, dto.id);

        if (u.relation === relation_status.BLOCKED)
            throw new WsException('your friend status is blocked');
        return u;
    }

    // GET

    async getJoinedRooms(user: UserDto)
    {
        const rooms = await this._prismaS.room.findMany({
            orderBy: {
                lst_msg_ts: 'desc'
            },
            where: {
                is_channel: true,
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
                lst_msg: true,
                lst_msg_ts: true,
                lst_msg_snd: true,
                user_rooms: {
                    select: {
                        uid: true,
                        is_owner: true,
                        joined_time: true,
                        is_banned: true,
                        is_muted: true,
                        unread: true,
                    }
                },
            },
        });

        let joined = [];
        for (let room of rooms)
        {
            let owner, me;
            let msg_from_blocked: boolean;

            room.user_rooms.forEach(ur => {
                if (ur.is_owner) owner = ur;
                if (ur.uid === user.id) me = ur;
            });
            const jt = me.joined_time;
            const blks = await this._user.getBlockedFriends(user.id);
            msg_from_blocked = blks.blocked.find(b =>  b.id === room.lst_msg_snd);

            (room.lst_msg_ts < jt || msg_from_blocked) && (room.lst_msg = "") && (room.lst_msg_ts = undefined);
            me.is_banned && (room.lst_msg = 'you are banned') && (room.lst_msg_ts = undefined);
            
            room["unread"] = me.unread;
            room['owner'] = owner.uid;
            room["is_banned"] = me.is_banned,
            room["is_muted"] = me.is_muted,
            delete room.user_rooms;
            joined.push(room);
        }
        return joined;
    }

    async ownedRooms(user: UserDto)
    {
        const rooms = await this._prismaS.room.findMany({
            where: {
                is_channel: true,
                user_rooms: {
                    some: {
                        uid: user.id,
                        is_owner: true,
                    }
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
            }
        });
        return rooms;
    }

    // added is_blocked to user
    async getDms(user: UserDto)
    {
        const rooms = await this._prismaS.room.findMany({
            orderBy: {
                lst_msg_ts: 'desc'
            },
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
                lst_msg: true,
                lst_msg_ts: true,
                user_rooms: {
                    // where: {
                    //     uid: { not: user.id }
                    // },
                    select: {
                        uid: true,
                        unread: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                                sentReq: {
                                    where: {
                                        OR: [
                                            { snd_id: user.id, },
                                            { rcv_id: user.id, }
                                        ]
                                    }
                                },recievedReq: {
                                    where: {
                                        OR: [
                                            { snd_id: user.id, },
                                            { rcv_id: user.id, }
                                        ]
                                    }
                                },
                            }
                        }
                    }
                }
            },
        });
        let joined = [];
        rooms.forEach((room) => {
            let other, me;
            room.user_rooms.forEach((ur) => {
                if (ur.uid === user.id) me = ur;
                else other = ur;
            });
            const req = other.user.sentReq.length === 1 ? other.user.sentReq[0] : (other.user.recievedReq.length === 1 ? other.user.recievedReq[0] : null);
            room["unread"] = me.unread;
            const is_blocked = (req && req.status === friend_status.BLOCKED) ? true : false;
            delete other.user.sentReq && delete other.user.recievedReq;
            delete room.user_rooms;
            joined.push({room, user: other.user, is_blocked});
        });
        return joined;
    }

    async newConnection(user: UserDto)
    {
        const u = await this._prismaS.user.update({
            where: {
                id: user.id
            },
            data: {
                status: user_status.ONLINE,
            },
            select: {
                user_rooms: {
                    where: {
                        is_banned: false,
                    },
                    select: {
                        room: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        let room_ids = [];
        for (let ur of u.user_rooms)
        {
            room_ids.push(ur.room.id);
        }
        return room_ids;
    }

    async getRooms(u: UserDto)
    {
        return await this._prismaS.room.findMany({
            orderBy: {
                lst_msg_ts: 'desc'
            },
            where: {
                is_channel: true,
                OR: [
                    {type: room_type.PUBLIC},{type: room_type.PROTECTED}
                ],
                user_rooms: {
                    none: {
                        uid: u.id,
                    }
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
            }
        });
    }

    async getRoomMembers(uid: string, rid: string)
    {
        const rs = await this._prismaS.room.findMany({
            where: {
                id: rid,
                user_rooms: {
                    some: {
                        uid, rid
                    }
                }
            },
            select: {
                is_channel: true,
                user_rooms: {
                    orderBy: {
                        joined_time: 'asc',
                    },
                    select: {
                        is_owner: true,
                        is_admin: true,
                        is_banned: true,
                        is_muted: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                            }
                        }
                    }
                }
            }
        });
        if (rs.length === 0)
            throw new WsException('room not found | you are not a member');

        let members = [];
        rs[0].user_rooms.forEach(ur => {
            ur.user['is_owner'] = ur.is_owner;
            ur.user['is_admin'] = ur.is_admin;
            ur.user['is_banned'] = ur.is_banned,
            ur.user['is_muted'] = ur.is_muted,
            members.push(ur.user);
        });

        return {is_channel: rs[0].is_channel, members};
    }

    async getRoomMessages(uid: string, rid: string)
    {
        const room = await this._prismaS.room.findUnique({
            where: {
                id: rid,
            },
            select: {
                id: true,
                name: true,
                type: true,
                is_channel: true,
                user_rooms: {
                    select: {
                        uid: true,
                        joined_time: true,
                        is_banned: true,
                        is_muted: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                                sentReq: {
                                    select: { rcv_id: true, status: true, }
                                },
                                recievedReq: {
                                    select: { snd_id: true, status: true, }
                                }
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        timestamp: 'asc',
                    },
                    where: {
                        rid,
                        room: {
                            user_rooms: {
                                some: { uid, is_banned: false, }
                            }
                        }
                    },
                    select: {
                        id: true,
                        msg: true,
                        timestamp: true,
                        type: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                status: true,
                                recievedReq: {
                                    where: {
                                        snd_id: uid,
                                        status: friend_status.BLOCKED,
                                    },
                                }
                            }
                        },
                    }
                }
            }
        });
        if (!room)
            throw new WsException('room not found');

        const my_ur = room.user_rooms.find(ur => ur.uid === uid);
        if (!my_ur)
        {
            if (room.type === room_type.PRIVATE)
                throw new WsException('room not found');
            delete room.user_rooms;
            delete room.messages;
            return { room };
        }

        await this._prismaS.userRoom.update({
            data: { unread: 0 },
            where: {
                uid_rid: { uid, rid }
            }
        });

        
        if (!room.is_channel)
        {
            const usr = room.user_rooms.find(ur => ur.uid !== uid).user;
            const req = usr.sentReq.find(sr => sr.rcv_id === uid) || usr.recievedReq.find(rr => rr.snd_id === uid) || null;
            usr['relation'] = req ? req.status : relation_status.NONE;
            delete usr.sentReq && delete usr.recievedReq;
            room['user'] = usr;
        }

        room['is_banned'] = my_ur.is_banned;
        room['is_muted'] = my_ur.is_muted;

        // filter messages sent before the user joined the room
        const jt = my_ur.joined_time;
        const msgs = room.messages.filter((message) => {
            return message.timestamp > jt && message.user.recievedReq.length === 0 && delete message.user.recievedReq;
        });

        delete room.user_rooms;
        delete room.messages;
        return { room, msgs };
    }

    // public helpers

    async getUserFromSocket(client: Socket)
    {
        const token = client?.handshake?.headers?.cookie?.split("=")[1];
        if (!token)
            return null;
        
        const user = await this._authS.getUserFromToken(token);
        return user;
    }

    // Private helpers

    private _to_millis(t: string) {
        if (t === 'inf')
            return 64757577600000; //01/01/4022
        const id = t[t.length-1];
        const time = Number(t.substring(0, t.length-1))

        let ms = time * 1000 * 60;
        if (id === 'H')
            ms *= 60;
        return ms;
    }

    private async _can_send_msg(uid1: string, uid2: string, rid: string)
    {
        const ur = await this._prismaS.userRoom.findMany({
            where: {
                uid: uid1, rid,
                OR: [
                    {
                        // case of channel
                        room: { is_channel: true, },
                        is_banned: false,
                        OR: [
                            {
                                is_muted: false,
                            },
                            {
                                is_muted: true,
                                unmute_at: { lte: new Date, },
                            }
                        ],
                    },
                    {
                        // case of dm
                        room: { is_channel: false, },
                        user: {
                            id: uid1,
                            OR: [
                                // blocked if friends
                                {
                                    recievedReq: {
                                        some: {
                                            snd_id: uid2,
                                            status: friend_status.ACCEPTED,
                                        }
                                    }
                                },
                                {
                                    sentReq: {
                                        some: {
                                            rcv_id: uid2,
                                            status: friend_status.ACCEPTED,
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
                room: {
                    select: {
                        is_channel: true,
                    }
                },
            }
        });
    
        if (ur.length === 0)
            throw new WsException({
                message: 'you can not send messages in this room at this moment',
                reason: 'not a member, banned or muted, blocked'
            });

        return true;
    }

    private async _add_msg_to_db(uid: string, data: AddMessageDto, type: string = msg_type.TXT)
    {
        const ts = new Date;
        const r = await this._prismaS.room.update({
            data: {
                lst_msg: data.msg,
                lst_msg_ts: ts,
                lst_msg_snd: uid,
                messages: {
                    create : { uid, msg: data.msg, timestamp: ts, type }
                },
                user_rooms: {
                    updateMany: {
                        data: { unread: { increment: 1, } },
                        where: { uid: { not: uid } },
                    }
                },
            },
            where: { id: data.rid },
            select: {
                user_rooms: {
                    where: { uid, rid: data.rid, },
                    select: {
                        uid: true,
                        rid: true,
                        is_muted: true,
                        unmute_at: true,
                        is_banned: true,
                    }
                },
                messages: {
                    where: { uid, rid: data.rid},
                    select: {
                        id: true,
                        msg: true,
                        type: true,
                        timestamp: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                            },
                        },
                        room: {
                            select: {
                                id: true,
                                name: true,
                                is_channel: true,
                            }
                        }
                    },
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            }
        });

        await this._prismaS.room.update({
            data: {
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
                        },
                    },
                },
            },
            where: {
                id: data.rid,
            },
        });
        return r.messages[0];
    }

    private async _is_admin(uid: string, rid: string)
    {
        const ur = await this._prismaS.userRoom.findMany({
            where: {
                uid,
                rid,
                is_admin: true,
            },
            select: {
                uid: true,
                rid: true,
                room: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        if (ur.length === 0)
            throw new WsException('room not found | you are not the owner');
        return ur[0].room;
    }

    private async _get_ur_if_admin(u: UserDto, ur: UserRoomDto)
    {
        return await this._prismaS.userRoom.findFirst({
            where: {
                uid: ur.uid,
                rid: ur.rid,
                room: {
                    is_channel: true,
                    user_rooms: {
                        some: {
                            uid: u.id,
                            rid: ur.rid,
                            is_admin: true,
                            is_banned: false,
                        },
                        none: {
                            uid: ur.uid,
                            rid: ur.rid,
                            is_owner: true,
                        }
                    }
                }
            },
            select: {
                is_banned: true,
            },
        });
    }

    private async _dm_exists(id1: string, id2: string)
    {
        const dms = await this._prismaS.room.findMany({
            where: {
                is_channel: false,
                AND: [
                    {
                        user_rooms: {
                            some: { uid: id1, }
                        }
                    },
                    {
                        user_rooms: {
                            some: { uid: id2 }
                        }
                    }
                ]
            },
            select: {
                id: true,
                is_channel: true,
                user_rooms: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                                sentReq: {
                                    where: {
                                        OR: [
                                            { snd_id: id1, },
                                            { rcv_id: id1, }
                                        ]
                                    }
                                },recievedReq: {
                                    where: {
                                        OR: [
                                            { snd_id: id1, },
                                            { rcv_id: id1, }
                                        ]
                                    }
                                },
                            }
                        }
                    },
                }
            }
        });
        if (dms.length === 0)
            return null;
        return dms[0];
    }
}
