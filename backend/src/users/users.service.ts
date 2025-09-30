import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  walletAddress: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private idCounter = 1;

  findOrCreate(walletAddress: string): User {
    let user = this.users.find(
      (u) => u.walletAddress.toLowerCase() === walletAddress.toLowerCase(),
    );

    if (!user) {
      user = {
        id: this.idCounter++,
        walletAddress,
      };
      this.users.push(user);
    }

    return user;
  }

  findByAddress(walletAddress: string): User | undefined {
    return this.users.find(
      (u) => u.walletAddress.toLowerCase() === walletAddress.toLowerCase(),
    );
  }
}
