import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/db.config';
import { jwtEnvs } from './config/jwt.env';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entity/user.entity';
import { UrlModule } from './url/url.module';
import { Url } from './url/entity/url.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, jwtEnvs],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        port: configService.get<number>('dbPort'),
        host: configService.get<string>('dbHost'),
        username: configService.get<string>('dbUser'),
        password: configService.get<string>('dbPassword'),
        database: configService.get<string>('db'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, Url],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    UrlModule,
  ],
})
export class AppModule {}
