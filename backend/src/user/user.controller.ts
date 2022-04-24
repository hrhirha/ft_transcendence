import { Body, Controller, ForbiddenException, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from './decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { Express } from 'express'
import { diskStorage } from 'multer';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    // User
    @Get('me')
    me(@GetUser() dto: User) {
        console.log({dto});
        return dto;
    }

    @Post('edit')
    edit(@GetUser('id') id: string, @Body() dto: EditUserDto) {
        return this.userService.edit(id, dto);
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
        console.log(file);
        return file;
    }
    // end of User

    // Friend Requests
    @Post('friendreq/send')
    sendFriendReq(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.sendFriendReq(snd.id, rcv.id);
    }

    @Post('friendreq/accept')
    acceptFriendReq(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.acceptFriendReq(snd.id, rcv.id);
    }

    @Post('friendreq/decline')
    declineFriendReq(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.declineFriendReq(snd.id, rcv.id);
    }


    @Get('friendreqs/sent')
    sentReqs(@GetUser() user: User) {
        return this.userService.sentReqs(user.id);
    }
    
    @Get('friendreqs/received')
    receivedReqs(@GetUser() user: User) {
        return this.userService.receivedReqs(user.id);
    }
    // end of Friend Requests

    // Friends Relation
    @Post('friend/unfriend')
    unfriend(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.unfriend(snd.id, rcv.id);
    }

    @Post('friend/block')
    block(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.block(snd.id, rcv.id);
    }

    @Post('friend/unblock')
    unblock(@GetUser() snd: User, @Body() rcv: { id: string }) {
        this.userService.unblock(snd.id, rcv.id);
    }


    @Get('friends')
    friends(@GetUser() user: User) {
        return this.userService.list(user.id);
    }
    // end of Friend Relation

    @Get('match/history')
    matchHistory() {
        return 'match history';
    }
}
