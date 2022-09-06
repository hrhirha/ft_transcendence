import { Body, Controller, ForbiddenException, Get, HttpStatus, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { GetUser, GetUserProfile } from 'src/user/decorator';
import { HOST, PORT } from 'src/utils';
import { AuthService } from './auth.service';
import { OAUth42Guard } from './guard';
import { Jwt2FAAuthGuard } from './guard/jwt-2fa-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetupDto } from 'src/user/dto';

@Controller('auth')
export class AuthController {
    
    constructor (private _authS: AuthService) {}

    @UseGuards(OAUth42Guard)
    @Get('login')
    async login(@GetUserProfile() dto: User, @Req() req: Request)
    {
        try
        {
            const u = await this._authS.login(dto, req);
            return u;
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            req.res.setHeader('Location', `http://${HOST}:3000/`).status(HttpStatus.PERMANENT_REDIRECT);
        }
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Post('setup')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename(req, file, callback) {
               const name = randomUUID() + file.originalname.slice(file.originalname.lastIndexOf('.'));
               callback(null, name);
            },
        }),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.((j|J)(p|P)(g|G)|(j|J)(p|P)(e|E)(g|G)|(p|P)(n|N)(g|G)|(g|G)(i|I)(f|F))$/))
                return callback(new ForbiddenException('format not allowed'), false)
            return callback(null, true);
        },
    }))
    async setup(@Req() req: Request, @UploadedFile() file: any, @Body() dto: SetupDto)
    {
        const user =  req.user as User;
        if (user.username !== "")
            throw new ForbiddenException({error: 'account has already been set up'});
        try
        {
            const _prisma = new PrismaService();
            const path = file ? file.path : "";

            const u = this._authS.setup(user, path, dto);
            return u;
        }
        catch (e)
        {
            throw new ForbiddenException({error: 'unable to setup this account'});
        }
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Get('profile')
    getProfile(@GetUser() dto: User)
    {
        return {
            fullName: dto.fullName,
            imageUrl: dto.imageUrl,
        };
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Get('logout')
    logout (@Req() req: Request) {
        req.res.setHeader('Set-Cookie', 'access_token=; HttpOnly; Path=/; Max-Age=0');
        return {logged_out: true};
    }
}
