import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDTO } from './dto/url.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Url } from './entity/url.entity';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiCreatedResponse({ type: Url, description: 'New shortened URL' })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  @ApiBody({ type: ShortenUrlDTO, description: 'Original URL to be shortened' })
  @UseGuards(JwtAuthGuard)
  @Post('short')
  shortenUrl(@Body() urlDto: ShortenUrlDTO, @CurrentUser() user: User) {
    return this.urlService.shortenUrl({ ...urlDto, user: user.id });
  }

  @ApiFoundResponse({
    type: [Url],
    description: 'List of URLs shortened by user',
  })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  listPersonalUrls(@CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException();

    return this.urlService.listPersonalUrls(user);
  }

  @ApiAcceptedResponse({
    type: Number,
    description: 'If URL was succesfully deleted returns 1',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: '6 characters ID of a short URL',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUrl(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException();

    return this.urlService.deletePersonalUrl(id, user);
  }

  @ApiQuery({
    name: 'shortUrl',
    example: 'http://localhost:3333/UQKGYD',
    description:
      'A previously shortened URL that will redirect to the original. Will not work on Postman or Swagger.',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiResponse({ status: 302 })
  @Get('redirect')
  async redirectToOriginal(
    @Query('shortUrl') shortUrl: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.findByShortUrl(shortUrl);

    return res.redirect(url.originalUrl);
  }
}
