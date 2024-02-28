import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'Password should be more than 6 characters long',
  })
    
  @IsString()
  password: string;
}
