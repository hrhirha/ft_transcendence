import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class Jwt2FAAuthGuard extends AuthGuard('jwt-2fa')
{
    constructor () {
        super();
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        if (err || !user)
        {
            throw new UnauthorizedException('invalid two-factor authentication');
        }
        return user;
    }
}