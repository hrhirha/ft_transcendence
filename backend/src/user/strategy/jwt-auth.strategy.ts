import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'
import { identity } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: any, cb: VerifiedCallback) {

        // retrieve user with (id == sub) from database and return it
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        const dto: UserDto = user;
        // const { id, ...dto} = user;

        return cb(null, dto);
    }
}