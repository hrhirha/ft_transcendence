import { Controller, ForbiddenException, Get, HttpStatus, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUserProfile } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
import { HOST } from 'src/utils';
import { AuthService } from './auth.service';
import { OAUth42Guard } from './guard';
import { Jwt2FAAuthGuard } from './guard/jwt-2fa-auth.guard';

@Controller('auth')
export class AuthController {
    
    constructor (private _authS: AuthService) {}

    @UseGuards(OAUth42Guard)
    @Get('login')
    async login(@GetUserProfile() dto: UserDto, @Req() req: Request)
    {
        // const token = req?.cookies?.access_token;
        // if (token && await this._authS.getUserFromToken(token))
        //     throw new ForbiddenException({success: false, message: "already logged in"});
        try
        {
            const u = await this._authS.login(dto, req);
            return {success: true};
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            req.res.setHeader('Location', `http://${HOST}:3000/`).status(HttpStatus.PERMANENT_REDIRECT);
            // throw new UnauthorizedException('login failed');
        }
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Get('logout')
    logout (@Req() req: Request) {
        req.res.setHeader('Set-Cookie', 'access_token=; HttpOnly; Path=/; Max-Age=0');
        return {logged_out: true};
    }
}
