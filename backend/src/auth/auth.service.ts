import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }

  async validateAndLogin(
    message: string,
    signature: string,
  ): Promise<{ access_token: string }> {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });

      // On successful verification, find or create the user.
      const user = this.usersService.findOrCreate(fields.data.address);

      // Create JWT payload and sign it.
      const payload = { walletAddress: user.walletAddress, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException(
        'Signature verification failed. Please try again.',
      );
    }
  }
}
