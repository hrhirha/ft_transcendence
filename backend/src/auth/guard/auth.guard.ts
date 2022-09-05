import { ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"
import { Observable } from "rxjs";
import { HOST } from "src/utils";

export class OAUth42Guard extends AuthGuard('42') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser
    {
        console.log({guard: 'oauth'})
        if (err || !user) {
            context.getRequest().res.setHeader('Location', `http://${HOST}:3000/login`);
            throw new HttpException("authentication failed", HttpStatus.PERMANENT_REDIRECT);
        }
        return user;
    }
}