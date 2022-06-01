import { ForbiddenException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Room, User } from '@prisma/client';
import * as argon2 from 'argon2'
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { room_type } from 'src/utils';
import { AddMessageDto, DeleteMessageDto, NewRoomDto, OldRoomDto, UserRoomDto } from './dto';

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
                throw new ForbiddenException('protected room requires a password');

            room.password = await argon2.hash(room.password);
        }

        const new_room = await this._prismaS.room.create({
            data: {
                ...room,
            }
        });
        await this._prismaS.userRoom.create({
            data: {
                uid: user.id,
                rid: new_room.id,
                is_owner: true,
                is_admin: true,
                is_banned: false,
                is_muted: false,
            }
        });
        return new_room;
    }

    async deleteRoom(user: User, room: OldRoomDto)
    {
        const user_room = await this._getUserRoom(user.id, room.id);
        if (!user_room)
        throw new ForbiddenException('room not found');
        if (!user_room.is_owner)
            throw new ForbiddenException('you are not the owner');
        const del = await this._prismaS.room.delete({
            where: {
                id: room.id,
            },
        });
        if (!del)
            throw new ForbiddenException('room not found');
        return {success: true}
    }

    async joinRoom(user: User, room: OldRoomDto)
    {
        const old_room = await this._getRoom(room.id);
        if (!old_room)
            throw new ForbiddenException('room not found');
        if (old_room.type === room_type.PRIVATE)
            throw new ForbiddenException('you can\'t join a private room');
        if (old_room.type == room_type.PROTECTED)
        {
            if (!room.password)
                throw new ForbiddenException('protected room requires a password');
            if (!(await argon2.verify(old_room.password, room.password)))
                throw new ForbiddenException('invalid password');
        }

        try
        {
            const user_room = await this._prismaS.userRoom.create({
                data: {
                    uid: user.id,
                    rid: old_room.id,
                    is_owner: false,
                    is_admin: false,
                    is_banned: false,
                    is_muted: false,
                }
            });
            return old_room;
        }
        catch (e)
        {
            throw new ForbiddenException('already a member');
        }
    }

    async leaveRoom(user: User, room: OldRoomDto)
    {
        // what should happen if the owner left the room?
        let r: Room;
        if (!(r = await this._getRoom(room.id)))
            throw new ForbiddenException('room not found');

        try
        {
            await this._prismaS.userRoom.delete({
                where: {uid_rid: {
                    uid: user.id,
                    rid: room.id
                }}
            });
            return r;
        }
        catch
        {
            throw new ForbiddenException('not a member');
        }
    }

    async addUser(user: User, member: UserRoomDto)
    {
        let user_room = await this._getUserRoom(user.id, member.rid);
        if (!user_room)
            throw new ForbiddenException('not a member');
        if (!user_room.is_owner)
            throw new ForbiddenException('not the owner');
        const u = await this._userS.findById(member.uid);
        if (!u)
            throw new ForbiddenException('user not found');

        try
        {
            user_room = await this._prismaS.userRoom.create({
                data: {
                    uid: member.uid,
                    rid: member.rid,
                    is_owner: false,
                    is_admin: false,
                    is_banned: false,
                    is_muted: false,
                }
            });
            return this._userS.publicData(u);
        }
        catch (e)
        {
            throw new ForbiddenException('user already a member');
        }
    }

    async removeUser(user: User, member: UserRoomDto)
    {
        let user_room = await this._getUserRoom(user.id, member.rid);
        if (!user_room)
            throw new ForbiddenException('not a member');
        if (!user_room.is_owner)
            throw new ForbiddenException('not the owner');
        const u = await this._userS.findById(member.uid);
        if (!u)
            throw new ForbiddenException('user not found');
        try
        {
            user_room = await this._prismaS.userRoom.delete({
                where: {
                    uid_rid: { ...member, }
                }
            });
            return this._userS.publicData(u);
        }
        catch
        {
            throw new ForbiddenException('user already removed from room');
        }
    }

    async addAdmin(user: User, user_room: UserRoomDto)
    {
        let uc = await this._getUserRoom(user.id, user_room.rid);

        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_owner)
            throw new ForbiddenException('not the owner');

        uc = await this._prismaS.userRoom.update({
            where: { uid_rid: { ...user_room } },
            data: { is_admin: true, }
        });
        return {success: true}
    }

    async removeAdmin(user: User, user_room: UserRoomDto)
    {
        let uc = await this._getUserRoom(user.id, user_room.rid);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_owner)
            throw new ForbiddenException('not the owner');

        uc = await this._prismaS.userRoom.update({
            where: { uid_rid: { ...user_room } },
            data: { is_admin: false, }
        });
        return {success: true}
}

    async banUser(user: User, user_room: UserRoomDto)
    {
        let uc = await this._getUserRoom(user.id, user_room.rid);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_admin)
            throw new ForbiddenException('not and admin');

        uc = await this._prismaS.userRoom.update({
            where: { uid_rid: { ...user_room } },
            data: { is_banned: true, }
        });
        return {success: true}
    }

    async unbanUser(user: User, user_room: UserRoomDto)
    {
        let uc = await this._getUserRoom(user.id, user_room.rid);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_admin)
            throw new ForbiddenException('not an admin');

        uc = await this._prismaS.userRoom.update({
            where: { uid_rid: { ...user_room } },
            data: { is_banned: false, }
        });
        return {success: true}
    }

    async addMessage(data: AddMessageDto)
    {
        // const user_room = await this._getUserRoom(data.uid, data.rid);
        if (!this._isMember(data.uid, data.rid))
            return null;
            // throw new ForbiddenException('not a member');
        const new_msg = await this._prismaS.message.create({
            data: {
                ...data,
            }
        });
        return new_msg;
    }

    async deleteMessage(user: User, msg: DeleteMessageDto)
    {
        if (!this._isMember(user.id, msg.rid))
            throw new ForbiddenException('not a member');
        const old_msg = await this._prismaS.message.findUnique({
            where: {id: msg.id}
        });
        if (!old_msg)
            throw new ForbiddenException('message not found');
        if (old_msg.uid !== user.id)
            throw new ForbiddenException('not your message');
        return await this._prismaS.message.delete({
            where: {id: msg.id}
        });
    }


    // get requests

    async getJoinedRooms(user: User) {
        const user_rooms = await this._getUserRoomsByUid(user.id);
        if (!user_rooms)
            throw new ForbiddenException('no joined rooms found');
        const rooms: Room[] = [];
        for (let user_room of user_rooms)
        {
            const room = await this._getRoom(user_room.rid);
            if (!room)
                throw new ForbiddenException('room not found');
            rooms.push(room);
        }
        return rooms;
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
        const cookie = client.handshake.headers.cookie;
        if (!cookie)
            return null;
        const token = cookie?.split("=")[1];
        
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
}
