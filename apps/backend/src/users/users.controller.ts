import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@ApiTags('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Find a user by email address` })
  @Get()
  async findAllUsers(@Query('email') emailToFind: string) {
    const user = await this.usersService.getUserBy({ email: emailToFind });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Delete a user` })
  @Delete()
  removeUser(@Query('email') email: string) {
    return this.usersService.removeUser(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Update a users email and / or password` })
  @Patch()
  async updateUser(
    @Query('email') emailToFind: string,
    @Body() body: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(emailToFind, body);

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }

    return updatedUser;
  }
}
