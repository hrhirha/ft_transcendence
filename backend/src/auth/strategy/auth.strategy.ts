import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from 'passport-42';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42') {
    constructor (config: ConfigService) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.REDIRECT_URI,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
        return cb(null, profile, {accessToken, refreshToken});
    }
}
