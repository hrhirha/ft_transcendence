import { ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { HOST } from "src/utils";

export class Jwt2FAAuthGuard extends AuthGuard('jwt-2fa')
{
    constructor () { super(); }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser
    {
        if (err || !user)
        {
            throw new UnauthorizedException({message: err?.message || "invalid access token"});
        }
        if (info === 'SETUP')
        {
            const req = context.getRequest();
            if (req.path === '/auth/setup' || req.path === '/auth/logout' || req.path === '/auth/profile')
                return user;

            throw new ForbiddenException({message: 'you must setup your account first'});
        }
        return user;
    }
}