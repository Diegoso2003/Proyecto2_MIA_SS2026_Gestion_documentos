import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator/types/validation/ValidationError.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('gestion-documentos/api/v1');
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: '*',
    allowedHeaders: '*',
    credentials: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errores: ValidationError[]) => {
        const mensajes = errores
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        const mensaje = mensajes.join(',\n');
        return new BadRequestException(mensaje);
      },
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
