import { AuthGuard } from "@nestjs/passport";

export class Jwt2FAAuthGuard extends AuthGuard('jwt-2fa') {}