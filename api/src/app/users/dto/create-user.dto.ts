import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { messageHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from 'src/helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: messageHelper.PASSWORD_VALID,
  })
  password: string;
}
