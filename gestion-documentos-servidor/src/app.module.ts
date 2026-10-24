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
import { CarpetaModule } from './carpeta/carpeta.module.js';
import { CompartidoModule } from './compartido/compartido.module.js';
import { DestacadoModule } from './destacado/destacado.module.js';
import { ComentarioModule } from './comentario/comentario.module.js';
import { DocumentoModule } from './documento/documento.module.js';
import { DatabaseModule } from './database/database.module.js';
import { PapeleraModule } from './papelera/papelera.module.js';

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
    CarpetaModule,
    CompartidoModule,
    DestacadoModule,
    ComentarioModule,
    DocumentoModule,
    DatabaseModule,
    PapeleraModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    AppService,
    EncriptadorService,
  ],
})
export class AppModule {}
