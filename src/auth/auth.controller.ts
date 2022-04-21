import { Controller, ForbiddenException, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { GetUser, GetUserProfile } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
import { AuthService } from './auth.service';
import { OAUth42Guard } from './guard';

@UseGuards(OAUth42Guard)
@Controller('auth')
export class AuthController {

    constructor (private authService: AuthService) {}

    @Get('login')
    login() {
        return ;
    }

    @Get('redirect')
    redirect(@GetUserProfile() dto: UserDto) {
        return this.authService.redirect(dto);
    }
}
