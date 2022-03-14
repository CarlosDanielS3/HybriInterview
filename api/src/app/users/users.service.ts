import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserI } from './dto/user.interface';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOneOrFail(
    conditions: FindConditions<UsersEntity>,
    options?: FindOneOptions<UsersEntity>,
  ): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail(conditions, options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(newUser: CreateUserDto): Promise<CreateUserDto> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.usersRepository.save(
          this.usersRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
    } catch (error) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  async update(id: string, user_data: UpdateUserDto): Promise<UsersEntity> {
    const user = await this.findOneOrFail({ id });
    this.usersRepository.merge(user, user_data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string): Promise<void> {
    await this.findOneOrFail({ id });
    await this.usersRepository.softDelete(id);
  }

  private async findOne(id: string): Promise<CreateUserDto> {
    return this.usersRepository.findOne({ id });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  private async findByEmail(email: string): Promise<CreateUserDto> {
    return this.usersRepository.findOne(
      { email },
      { select: ['id', 'email', 'name', 'password'] },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }
  public getOne(id: string): Promise<CreateUserDto> {
    return this.usersRepository.findOneOrFail({ id });
  }

    async login(user: UserI): Promise<string> {
    try {
      const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());
      if (foundUser) {
        const matches: boolean = await this.validatePassword(user.password, foundUser.password);
        if (matches) {
          const payload: UserI = await this.findOne(foundUser.id);
          return this.authService.generateJwt(payload);
        } else {
          throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (err){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
