import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractSignedJWT,
        JwtStrategy.extractUnsignedJWT, // TODO: Remove this once we have a signed cookie
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }

  private static extractUnsignedJWT(req: Request): string | null {
    if (
      req.cookies &&
      'alpha_sniper_access_token' in req.cookies &&
      req.cookies.alpha_sniper_access_token.length > 0
    ) {
      return req.cookies.alpha_sniper_access_token;
    }
    return null;
  }

  private static extractSignedJWT(req: Request): string | null {
    if (
      req.cookies &&
      'alpha_sniper_access_token' in req.signedCookies &&
      req.signedCookies.alpha_sniper_access_token.length > 0
    ) {
      return req.signedCookies.alpha_sniper_access_token;
    }
    return null;
  }
}
