import { Body, Controller, ForbiddenException, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';
import { EditUserDto, UserDto, UserIdDto } from './dto';
import { UserService } from './user.service';
import { Express } from 'express'
import { diskStorage } from 'multer';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { ChatService } from 'src/chat/chat.service';

@UseGuards(Jwt2FAAuthGuard)
@Controller('user')
export class UserController {

    constructor(
        private _userS: UserService,
        private _chatS: ChatService) {}

    // User
    @Get('me')
    me(@GetUser() dto: UserDto)
    {
        return dto;
    }
    
    @Post('edit')
    edit(@GetUser('id') id: string, @Body() dto: EditUserDto) {
        return this._userS.edit(id, dto);
    }

    @Post('avatar/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename(req, file, callback) {
               const name =  req.user['username'] + file.originalname.slice(file.originalname.lastIndexOf('.'));
               callback(null, name);
            },
        }),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
                return callback(new ForbiddenException('format not allowed'), false)
            return callback(null, true);
        },
    }))
    changeAvatar(@UploadedFile() file: any) {
        return file;
    }

    @Get('chatrooms')
    getJoinedChatRooms(@GetUser() user: User)
    {
        return this._chatS.getJoinedRooms(user);
    }

    // end of User

    // Friend Requests
    @Post('friendreq/send')
    async sendFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        try
        {
            return await this._userS.sendFriendReq(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not send friend request');
        }
    }

    @Post('friendreq/accept')
    async acceptFriendReq(@GetUser() rcv: User, @Body() snd: UserIdDto)
    {
        try
        {
            return await this._userS.acceptFriendReq(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not accept friend request');
        }
    }

    @Post('friendreq/decline')
    async declineFriendReq(@GetUser() rcv: User, @Body() snd: UserIdDto)
    {
        try
        {
            return await this._userS.declineFriendReq(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not decline friend request');
        }
    }


    @Get('friendreqs/sent')
    async sentReqs(@GetUser() user: User)
    {
        try
        {
            return await this._userS.sentReqs(user.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get sent friend requests');
        }
    }
    
    @Get('friendreqs/received')
    async receivedReqs(@GetUser() user: User)
    {
        try
        {
            return await this._userS.receivedReqs(user.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get received friend requests');
        }
    }
    // end of Friend Requests

    // Friends Relation
    @Post('friend/unfriend')
    async unfriend(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        try
        {
            return await this._userS.unfriend(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not unfriend user');
        }
    }

    @Post('friend/block')
    async block(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        try
        {
            return await this._userS.block(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not block user');
        }
    }

    @Post('friend/unblock')
    async unblock(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        try
        {
            return await this._userS.unblock(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not unblock user');
        }
    }


    @Get('friends')
    async friends(@GetUser() user: User)
    {
        try
        {
            return await this._userS.list(user.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get friends list');
        }
    }
    // end of Friend Relation

    @Get('match/history')
    matchHistory() {
        return 'match history';
    }

    @Get('id/:id')
    async getUserById(@GetUser() user: User, @Param('id') uid: string)
    {
        try
        {
            return await this._userS.getUserById(uid);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('user not found');
        }
    }

    @Get('username/:username')
    async getUserByUsername(@GetUser() user: User, @Param('username') username: string)
    {
        try
        {
            return await this._userS.getUserByUsername(username);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('user not found');
        }
    }
}
