import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/exception-filters/exception-filter';
import { LoggerService } from './common/custom-logger/logger.service';
import { LoggingInterceptor } from './common/custom-logger/logger.interceptor';
import { ResponseInterceptor } from './common/response-interceptor/response-interceptor';
import { generateSwaggerDocs } from './config/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api');

  generateSwaggerDocs(app);

  const configService: ConfigService = app.get(ConfigService);

  await app.listen(configService.get<number>('port'));
}
bootstrap();
