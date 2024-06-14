import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import typeorm from './config/typeorm';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    MovieModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
