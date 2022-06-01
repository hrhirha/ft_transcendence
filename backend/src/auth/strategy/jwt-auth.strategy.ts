import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private _prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.access_token;
            }]),
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
            expiresIn: config.get('JWT_ACCESS_EXP'),
        });
    }

    async validate(payload: any, cb: VerifiedCallback) {

        // retrieve user with (id == sub) from database and return it
        const user = await this._prisma.user.findUnique({
            where: { id: payload.sub, },
        });

        return cb(null, user);
    }
}
