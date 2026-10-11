import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async iniciarSesion(@Body() login: LoginDto){
    return this.loginService.iniciarSesion(login);
  }

}
