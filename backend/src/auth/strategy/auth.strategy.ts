import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { HOST, PORT } from "src/utils";

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42') {
    constructor (config: ConfigService) {
        const path = (process.env.CALLBACK[0]==='/'?'':'/')+process.env.CALLBACK
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `http://${HOST}:${PORT}${path}`,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
        return cb(null, profile, {accessToken, refreshToken});
    }
}
