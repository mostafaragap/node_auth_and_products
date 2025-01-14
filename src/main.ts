import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExcludePasswordInterceptor } from './interceptors/exclude-password.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalInterceptors(new ExcludePasswordInterceptor());

  await app.listen(3000);
}
bootstrap();