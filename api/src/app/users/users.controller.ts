import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponseI } from './dto/login-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { UserI } from './dto/user.interface';
import { UserHelperService } from './user-helper/user-helper.service';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private userHelperService: UserHelperService,
  ) {}
  @Get()
  async index() {
    return await this.usersService.findAll();
  }
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }
  @Get('/:id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOneOrFail({ id });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.destroy(id);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: UserI =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const jwt: string = await this.usersService.login(userEntity);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000,
    };
  }
}
