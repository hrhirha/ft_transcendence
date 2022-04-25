import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUserProfile } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
import { AuthService } from './auth.service';
import { OAUth42Guard } from './guard';

@UseGuards(OAUth42Guard)
@Controller('auth')
export class AuthController {

    constructor (private _authS: AuthService) {}

    @Get('login')
    login() {
        return ;
    }

    @Get('redirect')
    redirect(@GetUserProfile() dto: UserDto, @Req() req: Request) {
        return this._authS.redirect(dto, req);
    }
}
