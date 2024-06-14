import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitites';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseWithoutPassDto } from './dto/user-response-without-pass.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const user = new User({
      ...userDto,
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const mapperUser = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return mapperUser;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    return plainToInstance(UserResponseWithoutPassDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByIdWithRefreshToken(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return plainToInstance(UserResponseWithoutPassDto, [users], {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    const updateUser = new User({
      ...user,
      ...updateUserDto,
    });

    return await this.usersRepository.save(updateUser);
  }

  async delete(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    return await this.usersRepository.remove(user);
  }

  async clearAllUsers() {
    return await this.usersRepository.clear();
  }
}
