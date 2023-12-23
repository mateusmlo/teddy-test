import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ShortenUrlDTO {
  @IsUrl()
  @ApiProperty({
    example:
      'https://docs.imperva.com/bundle/on-premises-knowledgebase-reference-guide/page/abnormally_long_url.htm',
  })
  originalUrl: string;

  @ApiPropertyOptional({ example: 'ed69714e-b5cf-4a7e-91e7-78097a2e1431' })
  @IsOptional()
  user?: string;
}

export class UrlDTO {
  @IsUrl()
  originalUrl: string;

  //* optional values are automatically filled by the app but we still validate just in case
  @IsUrl()
  @IsOptional()
  shortUrl?: string;

  @IsNumber()
  @IsOptional()
  clickCount?: number;

  @IsString()
  @IsOptional()
  urlId?: string;

  @IsOptional()
  user?: string;
}
