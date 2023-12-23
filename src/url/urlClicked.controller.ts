import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { ApiNotFoundResponse, ApiResponse } from '@nestjs/swagger';

@Controller()
export class UrlClickedController {
  constructor(private readonly urlService: UrlService) {}

  @ApiResponse({
    status: 302,
    description:
      'Receives a click on a short URL, increments counter and redirects user to original URL. Will not work on Postman or Swagger.',
  })
  @ApiNotFoundResponse({ type: NotFoundException })
  @Get(':id')
  async shortenUrl(@Param('id') urlId: string, @Res() res: Response) {
    const url = await this.urlService.incrementClickCounter(urlId);

    return res.redirect(url.originalUrl);
  }
}
