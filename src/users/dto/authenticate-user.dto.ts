import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
