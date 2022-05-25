import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
import { ChatService } from './chat.service';
import { AddMessageDto, DeleteMessageDto, NewChatDto, OldChatDto, UserChatDto } from './dto';

@UseGuards(Jwt2FAAuthGuard)
@Controller('chat')
export class ChatController
{
    constructor (private _chatS: ChatService) {}

    // create ChatRoom
    @Post('create') // { name: string, type: string, password?: string }
    createChat(@GetUser() user: User, @Body() chat: NewChatDto)
    {
        return this._chatS.createChat(user, chat);
    }

    // delete ChatRoom
    @Post('delete') // { id: string }
    deleteChat(@GetUser() user: User, @Body() chat: OldChatDto)
    {
        return this._chatS.deleteChat(user, chat);
    }

    // join ChatRoom
    @Post('join') // { id: string, password?: string }
    joinChat(@GetUser() user: User, @Body() chat: OldChatDto)
    {
        return this._chatS.joinChat(user, chat);
    }

    // leave ChatRoom
    @Post('leave') // { id: string }
    leaveChat(@GetUser() user: User, @Body() chat: OldChatDto)
    {
        return this._chatS.leaveChat(user, chat);
    }

    // list public chatRooms
    @Get('all_public')
    listPublicChatRooms()
    {
        return this._chatS.getPublicRooms();
    }

    // list protected chatRooms
    @Get('all_protected')
    listProtectedChatRooms()
    {
        return this._chatS.getProtectedRooms();
    }

    // get ChatRoom members
    @Post('members') // { id: string }
    getAllMembers(@Body() chat: OldChatDto)
    {
        return this._chatS.getAllMembers(chat);
    }

    // add admin to ChatRoom
    @Post('add_admin') // { user_id: string, chat_id: string }
    addAdminToChat(@GetUser() user: User, @Body() user_chat: UserChatDto)
    {
        return this._chatS.addAdminToChat(user, user_chat);
    }

    // remove admin from ChatRoom
    @Post('remove_admin') // { user_id: string, chat_id: string }
    removeAdminFromChat(@GetUser() user: User, @Body() user_chat: UserChatDto)
    {
        return this._chatS.removeAdminToChat(user, user_chat);
    }

    // block User
    @Post('block_user') // { user_id: string, chat_id: string }
    blockUser(@GetUser() user: User, @Body() user_chat: UserChatDto)
    {
        return this._chatS.blockUser(user, user_chat);
    }

    // unblock User
    @Post('unblock_user') // { user_id: string, chat_id: string }
    unblockUser(@GetUser() user: User, @Body() user_chat: UserChatDto)
    {
        return this._chatS.unblockUser(user, user_chat);
    }

    // add user to chat
    @Post('add_user')
    addUserToChat(@GetUser() user: User, @Body() member: UserChatDto)
    {
        return this._chatS.addUserToChat(user, member);
    }

    // retreive old messages
    @Post('messages') // { user_id: string, chat_id: string }
    getAllMessages(@GetUser() user: User, @Body() chat: OldChatDto)
    {
        return this._chatS.getAllMessages(user, chat);
    }

    // add message
    // @Post('add_message') // { user_id: string, chat_id: string, msg: string }
    // addMessage(@GetUser() user: User, @Body() msg: AddMessageDto)
    // {
    //     return this._chatS.addMessage(user, msg);
    // }

    // delete message
    @Post('delete_message') // { id: string, chat_id: string}
    deleteMessage(@GetUser() user: User, @Body() msg: DeleteMessageDto)
    {
        return this._chatS.deleteMessage(user, msg);
    }

    // clear ChatRoom
    @Post('clear_chat')
    clearChat(@GetUser() user: User, @Body() chat: OldChatDto) {}
}
