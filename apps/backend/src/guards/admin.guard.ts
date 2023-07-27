import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const { role }: User = await this.usersService.getUserBy({
      userId: user.userId,
    });

    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException('you are not authorized');
    }

    return Promise.resolve(true);
  }
}
