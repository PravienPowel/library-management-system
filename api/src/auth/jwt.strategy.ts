import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // look for the token in the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // the app refuses to start if JWT_SECRET is missing from .env
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // runs after the token is verified
  // whatever we return here becomes req.user
  validate(payload: { sub: string; email: string; role: string }) {
    return { id: Number(payload.sub), email: payload.email, role: payload.role };
  }
}