import { Body, Controller, ForbiddenException, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
import { ChatService } from './chat.service';
import { DeleteMessageDto, NewRoomDto, OldRoomDto, UserRoomDto } from './dto';

@UseGuards(Jwt2FAAuthGuard)
@Controller('chat')
export class ChatController
{
    constructor (private _chatS: ChatService) {} 

    // join ChatRoom
    @Post('join') // { id: string, password?: string }
    joinRoom(@GetUser() user: User, @Body() chat: OldRoomDto)
    {
        /**
         * request:
         * {
         *      id: string,
         *      password?: string
         * }
         * response:
         * {
         *      "id": string,
         *      "name": string,
         *      "is_channel": boolean,
         *      "type": string,
         *      "password": string
         * }
         */
        return this._chatS.joinRoom(user, chat);
    }

    // leave ChatRoom
    @Post('leave') // { id: string }
    leaveRoom(@GetUser() user: User, @Body() chat: OldRoomDto)
    {
        /**
         * request:
         * {
         *      id: string,
         *      password?: string
         * }
         * response:
         * {
         *      "id": string,
         *      "name": string,
         *      "is_channel": boolean,
         *      "type": string,
         *      "password": string
         * }
         */
        return this._chatS.leaveRoom(user, chat);
    }

    // add user to chat room
    @Post('add_user')
    addUser(@GetUser() user: User, @Body() member: UserRoomDto)
    {
        /**
         * request:
         * {
         *      uid: string,
         *      rid: string
         * }
         * 
         * response:
         * {
         *      "id": string,
         *      "username": string,
         *      "email": string,
         *      "firstName": string,
         *      "lastName": string,
         *      "profileUrl": string,
         *      "imageUrl": string,
         *      "score": number,
         *      "status": string,
         *      "wins": number,
         *      "loses": number
         * }
         */
        return this._chatS.addUser(user, member);
    }

    // remove user from chat room
    @Post('remove_user')
    removeUser(@GetUser() user: User, @Body() member: UserRoomDto)
    {
        /**
         * request:
         * {
         *      uid: string,
         *      rid: string
         * }
         * 
         * response:
         * {
         *      "id": string,
         *      "username": string,
         *      "email": string,
         *      "firstName": string,
         *      "lastName": string,
         *      "profileUrl": string,
         *      "imageUrl": string,
         *      "score": number,
         *      "status": string,
         *      "wins": number,
         *      "loses": number
         * }
         */
        return this._chatS.removeUser(user, member);
    }

    // add admin to chat room
    @Post('add_admin') // { user_id: string, chat_id: string }
    async addAdmin(@GetUser() user: User, @Body() user_chat: UserRoomDto)
    {
        /**
         * request:
         * {
         *      uid: string,
         *      rid: string
         * }
         * 
         * response:
         * {
         *      "success": true
         * }
         */
        try
        {
            return await this._chatS.addAdmin(user, user_chat);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to add admin');
        }
    }

    // remove admin from chat room
    @Post('remove_admin') // { user_id: string, chat_id: string }
    removeAdmin(@GetUser() user: User, @Body() user_chat: UserRoomDto)
    {
        /**
         * request:
         * {
         *      uid: string,
         *      rid: string
         * }
         * 
         * response:
         * {
         *      "success": boolean
         * }
         */
        try
        {
            return this._chatS.removeAdmin(user, user_chat);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to add admin');
        }
    }

    // ban User
    // @Post('ban_user') // { user_id: string, chat_id: string }
    // banUser(@GetUser() user: User, @Body() user_chat: UserRoomDto)
    // {
    //     /**
    //      * request:
    //      * {
    //      *      uid: string,
    //      *      rid: string
    //      * }
    //      * 
    //      * response:
    //      * {
    //      *      "success": boolean
    //      * }
    //      */
    //     try
    //     {
    //         return this._chatS.banUser(user, user_chat);
    //     }
    //     catch (e)
    //     {
    //         console.log({e});
    //         if (e instanceof PrismaClientKnownRequestError)
    //         {
    //             const err_msg = e.code === 'P2025' ? "user or room not found" : e.message;
    //             throw new ForbiddenException(err_msg);
    //         }
    //         throw new InternalServerErrorException();
    //     }
    // }

    // unban User
    // @Post('unban_user') // { user_id: string, chat_id: string }
    // unbanUser(@GetUser() user: User, @Body() user_chat: UserRoomDto)
    // {
    //     /**
    //      * request:
    //      * {
    //      *      uid: string,
    //      *      rid: string
    //      * }
    //      * 
    //      * response:
    //      * {
    //      *      "success": boolean
    //      * }
    //      */
    //     try
    //     {
    //         return this._chatS.unbanUser(user, user_chat);
    //     }
    //     catch (e)
    //     {
    //         console.log({e});
    //         if (e instanceof PrismaClientKnownRequestError)
    //         {
    //             const err_msg = e.code === 'P2025' ? "user or room not found" : e.message;
    //             throw new ForbiddenException(err_msg);
    //         }
    //         throw new InternalServerErrorException();
    //     }
    // }

    // delete message
    @Post('delete_message') // { id: string, chat_id: string}
    deleteMessage(@GetUser() user: User, @Body() msg: DeleteMessageDto)
    {
        return this._chatS.deleteMessage(user, msg);
    }

    // clear ChatRoom
    @Post('clear_chat')
    clearRoom(@GetUser() user: User, @Body() chat: OldRoomDto) {}


    // list public chatRooms
    @Get('all_public')
    listPublicRooms()
    {
        return this._chatS.getPublicRooms();
    }

    // list protected chatRooms
    @Get('all_protected')
    listProtectedRooms()
    {
        return this._chatS.getProtectedRooms();
    }

    // get ChatRoom members
    @Get('/:rid/members')
    getAllMembers(@GetUser() me: User, @Param('rid') rid: string)
    {
        return this._chatS.getRoomMembers(me.id, rid);
    }

    // retreive old messages
    @Get('/:rid/messages')
    getAllMessages(@GetUser() me: User, @Param('rid') rid: string)
    {
        return this._chatS.getRoomMessages(me.id, rid);
    }
}
