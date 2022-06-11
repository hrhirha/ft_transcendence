import { Body, Controller, ForbiddenException, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
import { ChatService } from './chat.service';
import { OldRoomDto, UserRoomDto } from './dto';

@UseGuards(Jwt2FAAuthGuard)
@Controller('chat')
export class ChatController
{
    constructor (private _chatS: ChatService) {} 

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
    async removeAdmin(@GetUser() user: User, @Body() user_chat: UserRoomDto)
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
            return await this._chatS.removeAdmin(user, user_chat);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to add admin');
        }
    }

    // clear ChatRoom
    @Post('clear_chat')
    clearRoom(@GetUser() user: User, @Body() room: OldRoomDto) {}

    // list rooms
    @Get('rooms')
    async getRooms()
    {
        try
        {
            return await this._chatS.getRooms();
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to get rooms');
        }
    }

    // get ChatRoom members
    @Get('/:rid/members')
    async getAllMembers(@GetUser() me: User, @Param('rid') rid: string)
    {
        try
        {
            const rm = await this._chatS.getRoomMembers(me.id, rid);
            for (let m of rm.members) delete m.is_banned
            return rm.members;
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to retrieve room members');
        }
    }

    // retreive old messages
    @Get('/:rid/messages')
    async getAllMessages(@GetUser() me: User, @Param('rid') rid: string)
    {
        try
        {
            return await this._chatS.getRoomMessages(me.id, rid);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('failed to retrieve room messages');
        }
    }
}
