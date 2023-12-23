import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './types/auth-payload';
import { JWTPayload } from './types/jwt-payload';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid)
        throw new UnauthorizedException(`Invalid credentials`);

      return user;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async login(user: User): Promise<TokenPayload> {
    const jwtPayload: JWTPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return {
      accessToken,
    };
  }
}
