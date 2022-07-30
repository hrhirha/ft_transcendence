import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { HOST } from 'src/utils';
import { TFADto } from './dto';

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private _configS: ConfigService,
        private _userS: UserService,
        private _authS: AuthService,
    ) {}

    async generate(user: User)
    {
        const secret = authenticator.generateSecret();

        const otp_auth_url = authenticator.keyuri(
            user.username,
            process.env.TFA_APPNAME,
            secret
        );
        await this._userS.setTwoFactorAuthSecret(user.id, secret);
        return { secret, otp_auth_url };
    }

    async pipeQrStream(res: Response, otp_auth_url: string)
    {
        return toFileStream(res, otp_auth_url);
    }
    
    async enable(user: User, dto: TFADto, req: Request)
    {
        if (this.verify(user, dto))
        {
            await this._userS.enable2fa(user.id);
            const cookie = this._authS.getCookieWithJwtAccessToken(user.id, true);
            req.res.setHeader('Set-Cookie', [cookie]);
            return { success: true, }
        }
        throw new UnauthorizedException('invalid authentication code');
    }
    
    async disable(user: User, dto: TFADto)
    {
        if (this.verify(user, dto))
        {
            return await this._userS.disable2fa(user.id);
        }
        throw new ForbiddenException('invalid authentication code');
    }
    
    verify(user: User, dto: TFADto)
    {
        return authenticator.verify({
            token: dto.code,
            secret: user.tfaSecret,
        });
    }

    async authenticate(req: Request, dto: TFADto)
    {
        const user = req.user as User;
        if (!this.verify(user, dto))
            throw new UnauthorizedException('invalid authentication code');
        const cookie = this._authS.getCookieWithJwtAccessToken(user.id, true);
        req.res.setHeader('Set-Cookie', [cookie]);
        return { success: true };
    }
}
