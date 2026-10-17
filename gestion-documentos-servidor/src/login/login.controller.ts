import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from '../decorators/public/public.decorator.js';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post()
  async iniciarSesion(@Body() login: LoginDto){
    return this.loginService.iniciarSesion(login);
  }

}
