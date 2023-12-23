import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entity/url.entity';
import { Repository } from 'typeorm';
import { ShortenUrlDTO } from './dto/url.dto';
import { nanoid } from 'nanoid';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class UrlService {
  private logger = new Logger('UrlService');

  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
  ) {}

  async shortenUrl(urlDto: ShortenUrlDTO): Promise<Url> {
    const urlId = nanoid(6);
    const baseUrl = process.env.BASE_URL;

    try {
      const shortUrl = `${baseUrl}/${urlId}`;

      const newUrl = this.urlRepository.create({
        originalUrl: urlDto.originalUrl,
        urlId,
        shortUrl,
      });

      if (urlDto.user) newUrl.user = { id: urlDto.user } as User;

      return await this.urlRepository.save(newUrl);
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.code);
    }
  }

  async listPersonalUrls(user: User): Promise<Url[]> {
    try {
      return await this.urlRepository.find({
        where: { user: { id: user.id } },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.code);
    }
  }

  async deletePersonalUrl(urlId: string, user: User): Promise<number> {
    const url = await this.urlRepository.findOne({
      where: { urlId, user: { id: user.id } },
    });

    if (!url) throw new NotFoundException();

    return (await this.urlRepository.softDelete(url.urlId)).affected;
  }

  async incrementClickCounter(urlId: string) {
    const url = await this.urlRepository.findOne({ where: { urlId } });

    const result = (
      await this.urlRepository.increment({ urlId }, 'clickCount', 1)
    ).affected;

    if (result === 0) throw new NotFoundException();

    return url;
  }

  async findByShortUrl(shortUrl: string) {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });

    if (!url) throw new NotFoundException();

    await this.incrementClickCounter(url.urlId);

    return url;
  }
}
