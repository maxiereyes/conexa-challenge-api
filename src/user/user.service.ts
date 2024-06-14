import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitites';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(userDto: any) {
    return 'create user';
  }

  findByEmail(email: string) {
    return 'find user by email';
  }

  findById(id: string) {
    return 'find user by id';
  }

  findAll() {
    return 'find all users';
  }

  update(id: string, updateUserDto: any) {
    return 'update user';
  }

  delete(id: string) {
    return 'delete user';
  }
}
