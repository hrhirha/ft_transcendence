import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
    login(@GetUserProfile() dto: UserDto, @Req() req: Request) {
        return this._authS.login(dto, req);
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Get('logout')
    logout (@Req() req: Request) {
        req.res.setHeader('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
        return {logedout: true};
    }
}
