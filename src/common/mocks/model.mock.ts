import { Repository } from 'typeorm';
import { MockType } from './mock.type';

export const repositoryMock: () => MockType<Repository<any>> = jest.fn(
  () =>
    ({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      softDelete: jest.fn(),
      increment: jest.fn(),
    }) as any,
);
