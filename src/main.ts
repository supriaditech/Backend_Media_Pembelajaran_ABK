import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path'; // Pastikan ini diimpor dengan benar
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Aktifkan transformasi otomatis
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Menyajikan file di bawah /uploads/
  });
  await app.listen(3002);
}
bootstrap();
