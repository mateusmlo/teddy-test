import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private logger = new Logger('LocalStrategy');

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (!isEmail(email)) throw new BadRequestException('Invalid email');

    const user = await this.authService.validateUser(email, password);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
