import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { hashAndSalt } from '../utils/helpers';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.getUserBy({ email });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(pass, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async signUp(email: string, password: string) {
    const users = await this.usersService.getAllUsersByEmail(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const result = await hashAndSalt(password);

    const user = await this.usersService.createUser(email, result);

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
