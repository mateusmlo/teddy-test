import { MockType } from 'src/common/mocks/mock.type';
import { UrlService } from './url.service';
import { Repository } from 'typeorm';
import { Url } from './entity/url.entity';
import { UrlDTO } from './dto/url.dto';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../common/mocks/model.mock';
import { userMock } from '../user/user.service.spec';
import { User } from '../user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UrlService', () => {
  let service: UrlService;
  let repo: MockType<Repository<Url>>;

  const mockUrl: UrlDTO = {
    originalUrl: 'http://test.com/reallylongtesturltobeshortened',
    shortUrl: 'http://localhost:3333/xHJD92',
    clickCount: 0,
    urlId: 'xHJD92',
    user: '123',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useFactory: repositoryMock,
        },
      ],
    }).compile();

    service = module.get(UrlService);
    repo = module.get(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  beforeEach(() => {
    mockUrl.clickCount = 0;
  });

  describe('shortenUrl', () => {
    it('should shorten url given a big URL without user', async () => {
      jest.spyOn(repo, 'create').mockReturnValueOnce({
        originalUrl: mockUrl.originalUrl,
        shortUrl: mockUrl.shortUrl,
        urlId: mockUrl.urlId,
      });

      delete mockUrl.user;

      jest.spyOn(repo, 'save').mockReturnValueOnce(mockUrl);

      const newUrl = await service.shortenUrl({
        originalUrl: mockUrl.originalUrl,
      });

      expect(newUrl).toEqual(mockUrl);
    });

    it('should shorten url given a big URL with user', async () => {
      jest.spyOn(repo, 'create').mockReturnValueOnce({
        originalUrl: mockUrl.originalUrl,
        shortUrl: mockUrl.shortUrl,
        urlId: mockUrl.urlId,
      });

      jest.spyOn(repo, 'save').mockReturnValueOnce(mockUrl);

      const newUrl = await service.shortenUrl({
        originalUrl: mockUrl.originalUrl,
      });

      expect(newUrl).toEqual(mockUrl);
    });
  });

  describe('listPersonalUrls', () => {
    it('should find all user shortened urls', async () => {
      jest.spyOn(repo, 'find').mockReturnValueOnce([mockUrl]);

      await expect(service.listPersonalUrls(userMock as User)).resolves.toEqual(
        [mockUrl],
      );
    });
  });

  describe('deletePersonalUrl', () => {
    it('should delete url by id', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(mockUrl);
      jest.spyOn(repo, 'softDelete').mockReturnValueOnce({ affected: 1 });

      await expect(
        service.deletePersonalUrl(mockUrl.urlId, userMock as User),
      ).resolves.toEqual(1);
    });

    it('should throw if url not found', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(null);

      await expect(
        service.deletePersonalUrl('38213', userMock as User),
      ).rejects.toThrow(new NotFoundException());
    });
  });

  describe('incrementClickCounter', () => {
    it('should increment click counter when shortUrl is requested', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(mockUrl);
      jest.spyOn(repo, 'increment').mockReturnValueOnce({ affected: 1 });
      mockUrl.clickCount++;

      const increment = await service.incrementClickCounter(mockUrl.urlId);

      expect(increment).toEqual(mockUrl);
      expect(mockUrl.clickCount).toBeGreaterThan(0);
    });

    it('should throw if url not found', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(repo, 'increment').mockReturnValueOnce({ affected: 0 });

      await expect(service.incrementClickCounter('38213')).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });

  describe('findByShortUrl', () => {
    it('should find url by shortUrl value', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(mockUrl);
      jest.spyOn(repo, 'increment').mockReturnValueOnce({ affected: 1 });
      mockUrl.clickCount++;

      const url = await service.findByShortUrl(mockUrl.shortUrl);

      expect(url).toEqual(mockUrl as unknown as Url);
      expect(url.clickCount).toBeGreaterThan(0);
    });

    it('should throw if url not found', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(repo, 'increment').mockReturnValueOnce({ affected: 0 });

      await expect(service.findByShortUrl(mockUrl.shortUrl)).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });
});
