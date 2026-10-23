import { Module } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginController } from './login.controller.js';
import { EncriptadorModule } from '../seguridad/encriptador/encriptador.module.js';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  controllers: [LoginController],
  exports: [AuthGuard, JwtModule],
  providers: [LoginService, AuthGuard],
  imports: [
    EncriptadorModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
})
export class LoginModule {}
