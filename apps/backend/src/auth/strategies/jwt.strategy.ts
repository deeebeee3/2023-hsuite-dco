import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Payload {
  email: string;
  sub: string;
  iat: string | number;
  exp: string | number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<Record<string, string>>('jwt').secret,
    });
  }

  async validate(payload: Payload) {
    return { userId: payload.sub, email: payload.email };
  }
}
