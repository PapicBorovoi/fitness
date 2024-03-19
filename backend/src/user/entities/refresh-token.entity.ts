import { RefreshToken } from '../../../node_modules/.prisma/client';

export class RefreshTokenEntity implements RefreshToken {
  userId: string;
  expiresAt: Date;
  createdAt: Date;

  constructor(refreshToken: RefreshToken) {
    this.userId = refreshToken.userId;
    this.expiresAt = refreshToken.expiresAt;
    this.createdAt = refreshToken.createdAt;
  }
}
