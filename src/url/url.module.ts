import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entity/url.entity';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlClickedController } from './urlClicked.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlController, UrlClickedController],
  providers: [UrlService],
  exports: [UrlService, TypeOrmModule],
})
export class UrlModule {}
