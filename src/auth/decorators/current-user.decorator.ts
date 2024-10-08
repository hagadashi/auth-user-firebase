import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): any => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  });