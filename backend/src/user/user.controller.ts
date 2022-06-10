import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';
import { EditFullNameDto, EditUsernameDto, UserDto, UserIdDto } from './dto';
import { UserService } from './user.service';
import { Express } from 'express'
import { diskStorage } from 'multer';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { friend_status } from 'src/utils';

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
    
    @Patch('edit/username')
    async editUsername(@GetUser('id') id: string, @Body() dto: EditUsernameDto)
    {
        try
        {
            return await this._userS.editUsername(id, dto);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('username already taken');
        }
    }

    @Patch('edit/fullname')
    async editFullName(@GetUser('id') id: string, @Body() dto: EditFullNameDto)
    {
        try
        {
            return await this._userS.editFullName(id, dto);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('failed to change full name');
        }
    }

    @Patch('edit/avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename(req, file, callback) {
               const name =  req.user['username'] + "_"
                    + (new Date).toISOString()
                    + file.originalname.slice(file.originalname.lastIndexOf('.'));
               callback(null, name);
            },
        }),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
                return callback(new ForbiddenException('format not allowed'), false)
            return callback(null, true);
        },
    }))
    async editAvatar(@GetUser('id') id: string, @UploadedFile() file: any)
    {
        try
        {
            return await this._userS.editAvatar(id, file);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('failed to change avatar');
        }
    }

    @Get('chatrooms')
    async getJoinedChatRooms(@GetUser() user: User)
    {
        try
        {
            // modified
            return await this._chatS.getJoinedRooms(user);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('failed to get chatrooms');
        }
    }

    @Get('dms')
    async getDms(@GetUser() user: User)
    {
        try
        {
            return await this._chatS.getDms(user);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('failed to get dms');
        }
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
            return await this._userS.cancelFriendReq(snd.id, rcv.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not decline friend request');
        }
    }

    @Post('friendreq/cancel')
    async cancelFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        try
        {
            return await this._userS.cancelFriendReq(snd.id, rcv.id);
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
            return await this._userS.getFriends(user.id, friend_status.ACCEPTED);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get friends list');
        }
    }

    @Get('friends/blocked')
    async blockedFriends(@GetUser() user: User)
    {
        try
        {
            return await this._userS.getFriends(user.id, friend_status.BLOCKED);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get blocked friends list');
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

    @Get('u/:username')
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
