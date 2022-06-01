import { Injectable, UseGuards } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { Request } from 'express'
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../guard";

@UseGuards(JwtAuthGuard)
@Injectable()
export class Jwt2FAAuthStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(config: ConfigService, private _prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.access_token;
            }]),
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
            expiresIn: config.get('JWT_ACCESS_EXP'),
        });
    }

    async validate (payload: any, cb: VerifiedCallback) {
        const user = await this._prisma.user.findUnique({
            where: { id: payload.sub, },
        });
        if (user && (!user.isTfaEnabled || payload.is2fauthenticated))
            return cb(null, user);
    }
}