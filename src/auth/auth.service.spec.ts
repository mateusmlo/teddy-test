import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../common/mocks/model.mock';
import { User } from '../user/entity/user.entity';
import { userDto, userMock } from '../user/user.service.spec';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMock,
        },
      ],
    }).compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user if email and password match', async () => {
      const bcryptCompare = jest.fn().mockResolvedValueOnce(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(Promise.resolve(userMock as User));

      const validUser = await service.validateUser(
        userDto.email,
        userDto.password,
      );

      expect(validUser).toEqual(userMock);
    });

    it('should not login invalid credentials', async () => {
      const bcryptCompare = jest.fn().mockResolvedValueOnce(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(Promise.resolve(userMock as User));

      await expect(
        service.validateUser(userDto.email, '89123'),
      ).resolves.not.toEqual(userMock);
    });
  });
});
