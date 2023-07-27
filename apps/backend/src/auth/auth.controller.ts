import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignupDto } from './dtos/signup.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `The sign up endpoint` })
  @Post('signup')
  @Serialize(UserDto)
  async createUser(@Body() body: SignupDto) {
    const user = await this.authService.signUp(body.email, body.password);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `The login endpoint` })
  @Post('login')
  async login(@Request() req, @Response() res) {
    const userJwt = await this.authService.login(req.user);
    const { userId, email, role } = req.user;
    return res
      .status(201)
      .send({ user: { userId, email, role }, jwt: userJwt });
  }
}
