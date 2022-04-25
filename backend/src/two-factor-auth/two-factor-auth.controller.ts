import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/user/decorator';
import { TFADto } from './dto';
import { TwoFactorAuthService } from './two-factor-auth.service';

@UseGuards(JwtAuthGuard)
@Controller('2fa')
export class TwoFactorAuthController {
    constructor(private _tfaS: TwoFactorAuthService) {}

    @Post('generate')
    async generate(@GetUser() user: User, @Res() res: Response) {
        const {otp_auth_url} = await this._tfaS.generate(user);

        return this._tfaS.pipeQrStream(res, otp_auth_url);
    }

    @Post('enable')
    enable(@GetUser() user: User, @Body() dto: TFADto) {
        return this._tfaS.enable(user, dto);
    }

    @Post('disable')
    disable(@GetUser() user: User) {
        return this._tfaS.disable(user);
    }

    @Post('authenticate')
    authenticate(@Req() req: Request, @Body() dto: TFADto) {
        return this._tfaS.authenticate(req, dto);
    }
}
