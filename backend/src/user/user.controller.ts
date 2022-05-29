import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Post, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    me(@GetUser() dto: UserDto) {
        return dto;
    }

    @Get('/:id')
    async getUserById(@GetUser() user: User, @Param('id') uid: string)
    {
        let u: User;
    
        if (!(await this._userS.findById(user.id)))
            throw new UnauthorizedException('user not found');
        if (!(u = await this._userS.findById(uid)))
            throw new UnauthorizedException('user not found');

        return this._userS.publicData(u);
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
    changeAvatar(@UploadedFile() file: Express.Multer.File) {
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
    sendFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        if (!rcv.id) throw new BadRequestException('invalid id')
        return this._userS.sendFriendReq(snd.id, rcv.id);
    }

    @Post('friendreq/accept')
    acceptFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        if (!rcv.id) throw new BadRequestException('invalid id')
        return this._userS.acceptFriendReq(snd.id, rcv.id);
    }

    @Post('friendreq/decline')
    declineFriendReq(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        if (!rcv.id) throw new BadRequestException('invalid id')
        return this._userS.declineFriendReq(snd.id, rcv.id);
    }


    @Get('friendreqs/sent')
    sentReqs(@GetUser() user: User) {
        return this._userS.sentReqs(user.id);
    }
    
    @Get('friendreqs/received')
    receivedReqs(@GetUser() user: User) {
        return this._userS.receivedReqs(user.id);
    }
    // end of Friend Requests

    // Friends Relation
    @Post('friend/unfriend')
    unfriend(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        return this._userS.unfriend(snd.id, rcv.id);
    }

    @Post('friend/block')
    block(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        return this._userS.block(snd.id, rcv.id);
    }

    @Post('friend/unblock')
    unblock(@GetUser() snd: User, @Body() rcv: UserIdDto) {
        return this._userS.unblock(snd.id, rcv.id);
    }


    @Get('friends')
    friends(@GetUser() user: User) {
        return this._userS.list(user.id);
    }
    // end of Friend Relation

    @Get('match/history')
    matchHistory() {
        return 'match history';
    }
}
