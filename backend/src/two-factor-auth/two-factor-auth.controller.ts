import { Body, Catch, Controller, ForbiddenException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
import { TFADto } from './dto';
import { TwoFactorAuthService } from './two-factor-auth.service';

@UseGuards(JwtAuthGuard)
@Controller('2fa')
export class TwoFactorAuthController {
    constructor(private _tfaS: TwoFactorAuthService) {}

    @Post('generate')
    async generate(@GetUser() user: User, @Res() res: Response)
    {
        try
        {
            const {otp_auth_url} = await this._tfaS.generate(user);
            console.log({otp_auth_url});
            return this._tfaS.pipeQrStream(res, otp_auth_url);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('2fa secret already set');
        }
    }

    @Post('enable')
    async enable(@GetUser() user: User, @Body() dto: TFADto)
    {
        try
        {
            return await this._tfaS.enable(user, dto);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not enable two-factor authentication');
        }
    }

    @UseGuards(Jwt2FAAuthGuard)
    @Post('disable')
    async disable(@GetUser() user: User)
    {
        try
        {
            return await this._tfaS.disable(user);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not disable two-factor authentication');
        }
    }

    @Post('authenticate')
    async authenticate(@Req() req: Request, @Body() dto: TFADto)
    {
        try
        {
            return await this._tfaS.authenticate(req, dto);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('could not authenticate using 2fa');
        }
    }
}
