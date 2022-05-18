import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from 'passport-42';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42') {
    constructor (config: ConfigService) {
        super({
            clientID: config.get('42_UID'),
            clientSecret: config.get('42_SECRET'),
            callbackURL: '/auth/login',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
        return cb(null, profile, {accessToken, refreshToken});
    }
}