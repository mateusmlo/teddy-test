import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger('Users Service');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: UserAuthDto): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 14),
      });

      return {
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.code);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
