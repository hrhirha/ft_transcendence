import { Controller, ForbiddenException, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUserProfile } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
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
        const token = req?.cookies?.access_token;
        if (token && await this._authS.getUserFromToken(token))
            throw new ForbiddenException({success: false, message: "already logged in"});
        try
        {
            await this._authS.login(dto, req);
            return {logged_in: true}
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new UnauthorizedException('login failed');
        }
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Get('logout')
    logout (@Req() req: Request) {
        req.res.setHeader('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
        return {logged_out: true};
    }
}
