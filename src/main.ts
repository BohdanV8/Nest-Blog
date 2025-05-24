import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Дозволяємо фронтенду доступ
    credentials: true, // щоб працювали куки
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
