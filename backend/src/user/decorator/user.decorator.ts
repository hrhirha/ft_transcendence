import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dto';

export const GetUserProfile = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dto: UserDto = {
        username: request.user.username,
        email: request.user._json.email,
        firstName: request.user.name.givenName,
        lastName: request.user.name.familyName,
        profileUrl: request.user.profileUrl,
        imageUrl: request.user._json.image_url,
    };
    if (data) return dto[data];
    return dto;
  },
);

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const {createdAt, updatedAt, refresh_token, isTfaEnabled, tfaSecret, ...dto} = request.user;

    if (data) return dto[data];
    return dto;
  }
);
