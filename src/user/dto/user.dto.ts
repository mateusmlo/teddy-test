import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserAuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
    message: 'Invalid e-mail format',
  })
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Your password must contain at least one number, upper/lowercase letter and special character.',
  })
  @ApiProperty({ example: 'andEWU@*#754' })
  password: string;
}
