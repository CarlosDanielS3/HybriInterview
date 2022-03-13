import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'first_name', 'last_name', 'email'],
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

  async create(user_data: CreateUserDto): Promise<UsersEntity> {
    const user = await this.usersRepository.create(user_data);
    return await this.usersRepository.save(user);
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
}
