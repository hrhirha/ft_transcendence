import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Chat, User } from '@prisma/client';
import * as argon2 from 'argon2'
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { room_type } from 'src/utils';
import { AddMessageDto, DeleteMessageDto, NewChatDto, OldChatDto, UserChatDto } from './dto';

@Injectable()
export class ChatService {
    constructor (
        private _prismaS: PrismaService,
        private _userS: UserService,
        private _authS: AuthService
        ) {}

    async createChat(user: User, chat: NewChatDto)
    {
        // hash password for PROTECTED ChatRoom
        if (chat.type === room_type.PROTECTED)
        {
            if (!chat.password)
                throw new ForbiddenException('protected chat room must have a password');
            // chat.password = 'hashed_password';
            try
            {

                chat.password = await argon2.hash(chat.password);
            }
            catch
            {
                throw new InternalServerErrorException('argon3 failed');
            }
        }

        const new_chat = await this._prismaS.chat.create({
            data: {
                ...chat,
            }
        });
        const user_chat = await this._prismaS.userChat.create({
            data: {
                user_id: user.id,
                chat_id: new_chat.id,
                is_owner: true,
                is_admin: true,
                is_blocked: false,
            }
        });
        return new_chat;
    }

    async deleteChat(user: User, chat: OldChatDto)
    {
        const user_chat = await this._getUserChatById(user.id, chat.id);
        if (!user_chat || !user_chat.is_owner)
            throw new ForbiddenException('you are not the owner');
        const del = await this._prismaS.chat.delete({
            where: {
                id: chat.id,
            },
        });
        if (!del)
            throw new ForbiddenException('record not found');
        return {success: true}
    }

    async joinChat(user: User, chat: OldChatDto)
    {
        if (!chat.password)
            throw new ForbiddenException('protected chat room requires a password');
        const old_chat = await this._getChatById(chat.id);
        if (!old_chat)
            throw new ForbiddenException('record not found');
        if (old_chat.type === room_type.PRIVATE)
            throw new ForbiddenException('private chat room');
        if (old_chat.type == room_type.PROTECTED)
        {
            if (!(await argon2.verify(old_chat.password, chat.password)))
                throw new ForbiddenException('invalid password');
        }

        try 
        {
            const user_chat = await this._prismaS.userChat.create({
                data: {
                    user_id: user.id,
                    chat_id: old_chat.id,
                    is_owner: false,
                    is_admin: false,
                    is_blocked: false,
                }
            });
        }
        catch
        {
            throw new ForbiddenException('similar record exist');
        }
        return {success: true};
    }

    async leaveChat(user: User, chat: OldChatDto)
    {
        // what should happen if the owner left the room?

        try
        {

            const user_chat = await this._prismaS.userChat.delete({
                where: {user_id_chat_id: {
                    user_id: user.id,
                    chat_id: chat.id
                }}
            });
        }
        catch
        {
            throw new ForbiddenException('record not found');
        }
        return {success: true};
    }

    async getJoinedRooms(user: User) {
        const user_chats = await this._getAllUserChats(user.id);
        if (!user_chats)
            throw new ForbiddenException('no joined rooms found');
        const rooms: Chat[] = [];
        for (let user_chat of user_chats)
        {
            const room = await this._getChatById(user_chat.chat_id);
            if (!room)
                throw new ForbiddenException('no chatRoom found');
            rooms.push(room);
        }
        return rooms;
    }

    async getPublicRooms()
    {
        const rooms = await this._getChatsByType(room_type.PUBLIC);
        if (!rooms)
            throw new ForbiddenException('no public chatRooms found');
        return rooms;
    }

    async getProtectedRooms()
    {
        const rooms = await this._getChatsByType(room_type.PROTECTED);
        if (!rooms)
            throw new ForbiddenException('no public chatRooms found');
        return rooms;
    }

    async getAllMembers(chat: OldChatDto)
    {
        const user_chats = await this._prismaS.userChat.findMany({
            where: {
                chat_id: chat.id,
            }
        });
        if (!user_chats)
            throw new ForbiddenException('records not found');
        let members: User[] = [];
        for (let user_chat of user_chats)
        {
            const user = await this._userS.findById(user_chat.user_id);
            members.push(user);
        }
        return members;
    }

    async addAdminToChat(user: User, user_chat: UserChatDto)
    {
        let uc = await this._getUserChatById(user.id, user_chat.chat_id);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_owner)
            throw new ForbiddenException('not the owner');

        try
        {

            uc = await this._prismaS.userChat.update({
                where: { user_id_chat_id: { ...user_chat } },
                data: { is_admin: true, }
            });
            return {success: true}
        }
        catch
        {
            throw new ForbiddenException('record not found');
        }
    }

    async removeAdminToChat(user: User, user_chat: UserChatDto)
    {
        let uc = await this._getUserChatById(user.id, user_chat.chat_id);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_owner)
            throw new ForbiddenException('not the owner');

        try
        {

            uc = await this._prismaS.userChat.update({
                where: { user_id_chat_id: { ...user_chat } },
                data: { is_admin: false, }
            });
            return {success: true}
        }
        catch
        {
            throw new ForbiddenException('record not found');
        }
    }

    async blockUser(user: User, user_chat: UserChatDto)
    {
        let uc = await this._getUserChatById(user.id, user_chat.chat_id);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_admin)
            throw new ForbiddenException('not and admin');

        try
        {

            uc = await this._prismaS.userChat.update({
                where: { user_id_chat_id: { ...user_chat } },
                data: { is_blocked: true, }
            });
            return {success: true}
        }
        catch
        {
            throw new ForbiddenException('record not found');
        }
    }

    async unblockUser(user: User, user_chat: UserChatDto)
    {
        let uc = await this._getUserChatById(user.id, user_chat.chat_id);
        if (!uc)
            throw new ForbiddenException('not a member');
        if (!uc.is_admin)
            throw new ForbiddenException('not and admin');

        try
        {

            uc = await this._prismaS.userChat.update({
                where: { user_id_chat_id: { ...user_chat } },
                data: { is_blocked: false, }
            });
            return {success: true}
        }
        catch
        {
            throw new ForbiddenException('record not found');
        }
    }

    async addUserToChat(user: User, member: UserChatDto)
    {
        let user_chat = await this._getUserChatById(user.id, member.chat_id);
        // console.log({user_id: user.id, chat_id: member.chat_id});
        if (!user_chat || !user_chat.is_admin)
            throw new ForbiddenException('not a member or not an admin');
        user_chat = await this._prismaS.userChat.create({
            data: {
                user_id: member.user_id,
                chat_id: member.chat_id,
                is_owner: false,
                is_admin: false,
                is_blocked: false
            }
        });
        return user_chat;
    }

    async getAllMessages(user: User, chat: OldChatDto)
    {
        let user_chat = await this._getUserChatById(user.id, chat.id);
        if (!user_chat)
            throw new ForbiddenException('not a member');
        const messages = await this._prismaS.message.findMany({
            where: {
                chat_id: chat.id
            },
            orderBy:{
                timestamp: 'desc',
            },
        });
        if (!messages)
            throw new ForbiddenException('record not found');
        messages.filter((message) => {
            message.timestamp >= user_chat.joined_time;
        });
        return messages;
    }

    async addMessage(data: AddMessageDto)
    {
        const user_chat = await this._getUserChatById(data.user_id, data.chat_id);
        if (!user_chat)
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
        const user_chat = await this._getUserChatById(user.id, msg.chat_id);
        if (!user_chat)
            throw new ForbiddenException('not a member');
        const old_msg = await this._prismaS.message.findUnique({
            where: {id: msg.id}
        });
        if (!old_msg)
            throw new ForbiddenException('record not found');
        if (old_msg.user_id !== user.id)
            throw new ForbiddenException('not your message');
        return await this._prismaS.message.delete({
            where: {id: msg.id}
        });
    }

    //
    async getUserFromSocket(client: Socket)
    {
        const cookie = client.handshake.headers.cookie;
        const token = cookie?.split("=")[1];
        
        const user = await this._authS.getUserFromToken(token);
        // if (!user)
        //     throw new WsException('user not logged in');
        return user;
    }

    // Private methods
    private async _getChatById(id: string) {
        return await this._prismaS.chat.findUnique({
            where: { id }
        });
    }

    private async _getUserChatById(user_id: string, chat_id: string)
    {
        return await this._prismaS.userChat.findFirst({
            where: { user_id, chat_id }
        });
    }

    private async _getAllUserChats(user_id: string)
    {
        return await this._prismaS.userChat.findMany({
            where: { user_id }
        });
    }

    private async _getChatsByType(type: string)
    {
        return await this._prismaS.chat.findMany({
            where: {
                type
            }
        });
    }
}
