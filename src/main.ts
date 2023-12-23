import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { otelSDK } from 'tracing';

//TODO: write README

async function bootstrap() {
  await otelSDK.start();

  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const options = new DocumentBuilder()
    .setTitle('URL shortener')
    .setVersion('1.0')
    .addTag('teddy-open-finance')
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.APP_PORT, async () => {
    const appUrl = await app.getUrl();

    logger.log(`⭐️ App running at ${appUrl}`);
    logger.log(`📚 API docs at ${appUrl}/docs`);
    logger.log(`🌡️  API tracing at http://localhost:8081/metrics`);
  });
}

bootstrap();
