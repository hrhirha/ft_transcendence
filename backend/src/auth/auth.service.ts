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

    async login(dto: UserDto, req: Request) {

        let user = await this._prismaS.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (!user) {
            user = await this._prismaS.user.create({ data: { ...dto, } });
        }

        const cookie = this.getCookieWithJwtAccessToken(user.id);
        req.res.setHeader('Set-Cookie', cookie)
            .setHeader('Location', 'http://127.0.0.1:3000/')
            .status(HttpStatus.PERMANENT_REDIRECT);
        return dto;
    }

    getCookieWithJwtAccessToken(id: string, is2fauthenticated = false) {
        const payload = { sub: id, is2fauthenticated };
        
        const secret = this._configS.get('JWT_ACCESS_SECRET');
        const exp_time = this._configS.get('JWT_ACCESS_EXP');
        const options = { secret, expiresIn: exp_time };
        
        const access_token = this._jwtS.sign(payload, options);

        return `Authentication=${access_token}; Path=/; Max-Age=${exp_time}; HttpOnly`;
    }

    async getUserFromToken(token: string)
    {
        const payload = this._jwtS.verify(token, {
            secret: this._configS.get('JWT_ACCESS_SECRET')
        });

        if (payload.sub) {
            const user =  await this._userS.findById(payload.sub);
            return user;
        }
        return null;
    }
}
