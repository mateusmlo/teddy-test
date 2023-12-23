import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserAuthDto } from './dto/user.dto';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ description: 'New user created' })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorException })
  @ApiBody({ type: UserAuthDto })
  @Post('register')
  signUp(@Body() createUserDto: UserAuthDto) {
    return this.userService.createUser(createUserDto);
  }
}
