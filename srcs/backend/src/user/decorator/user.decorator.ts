import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserProfile = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dto = {
        username: request.user.username,
        email: request.user._json.email,
        fullName: request.user.displayName,
        imageUrl: request.user._json.image_url,
    };
    if (data) return dto[data];
    return dto;
  },
);

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // const {createdAt, updatedAt, refresh_token, tfaSecret, ...dto} = request.user;
    const dto = request.user;

    if (data) return dto[data];
    return dto;
  }
);
