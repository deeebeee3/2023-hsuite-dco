import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* describe block just helps better organise tests */
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      getAllUsersByEmail: (email: string): Promise<User[]> => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (email: string, password: string): Promise<User> => {
        const user = {
          userId: uuidv4(),
          email,
          password,
          role: UserRole.USER,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UsersService, useValue: fakeUsersService },
        // {
        //   provide: JwtService,
        //   useValue: {
        //     sign: () => 'valid.token',
        //   },
        // },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', 'passwordx');

    expect(user.password).not.toEqual('passwordx');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');

    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  /* TODO: fix the below tests */

  // it('throws if signin is called with an unused email', async () => {
  //   await expect(
  //     service.login({
  //       email: 'asdflkj@asdlfkj.com',
  //       password: 'passdflkj',
  //     } as User),
  //   ).rejects.toThrow(NotFoundException);
  // });

  // it('throws if an invalid password is provided', async () => {
  //   await service.signUp('laskdjf@alskdfj.com', 'password');

  //   await expect(
  //     service.login('laskdjf@alskdfj.com', 'laksdlfkj'),
  //   ).rejects.toThrow(BadRequestException);
  // });

  // it('returns a user if correct password is provided', async () => {
  //   await service.signUp('asdf@asdf.com', 'mypassword');

  //   const user = await service.login({
  //     email: 'asdf@asdf.com',
  //     password: 'mypassword',
  //   } as User);

  //   console.log(user);

  //   expect(user).toBeDefined();
  // });
});
