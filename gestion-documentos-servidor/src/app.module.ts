import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncriptadorModule } from './seguridad/encriptador/encriptador.module.js';
import { EncriptadorService } from './seguridad/encriptador/encriptador.service.js';
import { LoginModule } from './login/login.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './login/auth/auth.guard.js';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    EncriptadorModule,
    LoginModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    AppService,
    EncriptadorService,
  ],
})
export class AppModule {}
