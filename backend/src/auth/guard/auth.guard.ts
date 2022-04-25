import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"
import { Observable } from "rxjs";

export class OAUth42Guard extends AuthGuard('42') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        if (err || !user) {
            throw new UnauthorizedException('problem authenticating with 42 API');
        }
        return user;
    }
}