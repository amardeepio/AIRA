import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'DEV_SECRET_CHANGE_IN_PROD',
    });
  }

  validate(payload: { sub: number; walletAddress: string }) {
    // The payload is the decoded JWT. We can trust it here after verification.
    // This returned object will be attached to the request object as request.user
    return { userId: payload.sub, walletAddress: payload.walletAddress };
  }
}
