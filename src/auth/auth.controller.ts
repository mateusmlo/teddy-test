import {
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/user/decorators/get-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenPayload } from './types/auth-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('local')
  @ApiCreatedResponse({ type: TokenPayload, description: 'Access token' })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @ApiBearerAuth('jwt')
  @ApiCreatedResponse({ type: User, description: 'Current authenticated user' })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User): User {
    //console.log(user);

    return user;
  }
}
