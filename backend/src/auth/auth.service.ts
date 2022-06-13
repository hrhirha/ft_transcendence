import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private _configS: ConfigService,
        private _jwtS: JwtService,
        private _prismaS: PrismaService,
        private _userS: UserService
    ){}

    async login(dto: UserDto, req: Request)
    {
        const user = await this._prismaS.user.upsert({
            where: {email: dto.email, },
            update: {},
            create: {
                ...dto
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                imageUrl: true,
                score: true,
                rank: true,
                wins: true,
                loses: true,
                status: true,
            }
        });

        const referer = req.header("Referer") || "http://127.0.0.1:3000";

        const cookie = this.getCookieWithJwtAccessToken(user.id);
        req.res.setHeader('Set-Cookie', cookie)
            .setHeader('Location', referer)
            .status(HttpStatus.PERMANENT_REDIRECT);
        return user;
    }

    getCookieWithJwtAccessToken(id: string, is2fauthenticated = false) {
        const payload = { sub: id, is2fauthenticated };

        const secret = this._configS.get('JWT_ACCESS_SECRET');
        const exp_time = this._configS.get('JWT_ACCESS_EXP');
        const options = { secret, expiresIn: exp_time };

        const access_token = this._jwtS.sign(payload, options);

        return `access_token=${access_token}; Path=/; Max-Age=${exp_time}; HttpOnly; SameSite=Lax`;
    }

    async getUserFromToken(token: string)
    {
        let payload: any;
        try
        {
            payload = this._jwtS.verify(token, {
                secret: this._configS.get('JWT_ACCESS_SECRET'),
            });
            if (payload.sub) {
                const user =  await this._userS.findById(payload.sub);
                return user;
            }
        }
        catch
        {
            return null;
        }
    }
}
