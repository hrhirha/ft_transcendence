import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { TFADto } from './dto';

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private _configS: ConfigService,
        private _userS: UserService,
        private _authS: AuthService,
    ) {}

    async generate(user: User) {
        const secret = authenticator.generateSecret();

        const otp_auth_url = authenticator.keyuri(
            user.username,
            this._configS.get('2FA_APP_NAME'),
            secret
        );
        await this._userS.setTwoFactorAuthSecret(user.id, secret);
        return { secret, otp_auth_url };
    }

    async pipeQrStream(res: Response, otp_auth_url: string) {
        return toFileStream(res, otp_auth_url);
    }
    
    enable(user: User, dto: TFADto) {
        if (this.verify(user, dto)) {
            return this._userS.enable2fa(user.id);
        }
        throw new UnauthorizedException('invalide authentication code');
    }
    
    disable(user: User) {
        return this._userS.disable2fa(user.id);
    }
    
    verify(user: User, dto: TFADto) {
        return authenticator.verify({
            token: dto.secret,
            secret: user.tfaSecret,
        });
    }

    async authenticate(req: Request, dto: TFADto) {
        const user = req.user as User;
        if (!this.verify(user, dto))
            throw new UnauthorizedException('invalid authentication code');
        const cookie = this._authS.getCookieWithJwtAccessToken(user.id, true);
        req.res.setHeader('Set-Cookie', [cookie]);
        return req.user;
    }
}
