import { ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { HOST } from "src/utils";

export class JwtAuthGuard extends AuthGuard('jwt')
{
    constructor () { super(); }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser
    {
        if (err || !user)
        {
            throw new UnauthorizedException({error: err?.message || "invalid access token"});
        }
        if (info === 'SETUP')
        {
            const req = context.getRequest();
            if (req.path === '/auth/setup' || req.path === '/auth/logout')
                return user;

            // req.res.setHeader('Location', `http://${HOST}:3000/setup`);
            // throw new HttpException("", HttpStatus.TEMPORARY_REDIRECT);
            throw new ForbiddenException({error: 'you must setup your account first'});
        }
        return user;
    }
}