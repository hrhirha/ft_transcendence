import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';
import { EditFullNameDto, EditUsernameDto, UserDto, UserIdDto } from './dto';
import { UserService } from './user.service';
import { Request } from 'express'
import { diskStorage } from 'multer';
import { PrismaClient, User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(Jwt2FAAuthGuard)
@Controller('user')
export class UserController {

    constructor(
        private _userS: UserService) {}

    // User

    @Get('all')
    async getAll(@GetUser() user: User)
    {
        try
        {
            return await this._userS.getAll(user);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('could not get all users');
        }
    }

    @Get('me')
    async me(@GetUser() dto: User)
    {
        return {
            id: dto.id,
            username: dto.username,
            fullName: dto.fullName,
            imageUrl: dto.imageUrl,
            score: dto.score,
            rank: await this._userS.getRank(dto.rank_id),
            wins: dto.wins,
            loses: dto.loses,
            status: dto.status,
            isTfaEnabled: dto.isTfaEnabled,
            relation: null,
        };
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
                    + randomUUID()
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
    async editAvatar(@GetUser('id') id: string, @UploadedFile() file: any, @Req() req: Request)
    {
        try
        {
            if (!file) throw new BadRequestException({error: 'no file was uploaded'});
            await this._userS.editAvatar(id, file);
            const f = createReadStream(join(file.path));
            req.res.setHeader("Content-Type", file.mimetype);
            return new StreamableFile(f);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new ForbiddenException('failed to change avatar');
        }
    }

    // end of User

    // Friend Requests
    @Post('friendreq/send')
    async sendFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto)
    {
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
        if(snd.id === rcv.id)
            throw new ForbiddenException('sender and receiver can not be the same');
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
            return await this._userS.getFriends(user.id);
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
            return await this._userS.getBlockedFriends(user.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not get blocked friends list');
        }
    }
    // end of Friend Relation

    @Get('id/:id')
    async getUserById(@GetUser() user: User, @Param('id') uid: string)
    {
        if (!(/^c[a-z0-9]{20,}$/.test(uid)))
            throw new ForbiddenException("Invalid id format");
        try
        {
            return await this._userS.getUserById(user, uid);
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
        if (!(/^[\w-]{4,20}$/.test(username)))
            throw new ForbiddenException("Invalid username format");
        try
        {
            return await this._userS.getUserByUsername(user, username);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('user not found');
        }
    }
}
