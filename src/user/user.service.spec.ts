import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from '../common/mocks/mock.type';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../common/mocks/model.mock';
import { UserAuthDto } from './dto/user.dto';

export const userMock = {
  id: '123',
  email: 'test@test.com',
};

export const userDto: UserAuthDto = {
  email: 'test@test.com',
  password: '31872#&(@*fbnhHJ',
};

describe('UserService', () => {
  let service: UserService;
  let repo: MockType<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      repo.save.mockReturnValue(userMock);

      const newUser = await service.createUser(userDto);

      expect(newUser).toEqual(userMock);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      repo.findOne.mockReturnValue(userMock);

      await expect(service.findByEmail(userMock.email)).resolves.toEqual(
        userMock,
      );
    });
  });
});
