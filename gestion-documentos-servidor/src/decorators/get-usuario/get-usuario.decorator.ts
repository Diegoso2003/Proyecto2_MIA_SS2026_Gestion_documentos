import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUsuario = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const usuario = request.usuario;

    return data ? usuario?.[data] : usuario;
  },
);

