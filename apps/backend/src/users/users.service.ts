import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { hashAndSalt } from '../utils/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserBy(param: Record<string, any>): Promise<User> {
    const user = await this.usersRepository.findOne(param);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async getAllUsersByEmail(email: string): Promise<User[]> {
    return this.usersRepository.find({ email });
  }

  async createUser(email: string, password: string): Promise<User> {
    return this.usersRepository.create({
      userId: uuidv4(),
      email,
      password,
      role: UserRole.USER,
    });
  }

  async updateUser(email: string, userUpdates: UpdateUserDto): Promise<User> {
    if ('password' in userUpdates) {
      const result = await hashAndSalt(userUpdates.password);

      userUpdates.password = result;
    }

    return this.usersRepository.findOneAndUpdate({ email }, userUpdates);
  }

  async removeUser(email: string) {
    const user = await this.getUserBy({ email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.usersRepository.removeById(user.userId);
  }
}
