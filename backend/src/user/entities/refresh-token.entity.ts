import { RefreshTokenPayload } from 'src/shared/types/token.type';

export class RefreshTokenEntity implements RefreshTokenPayload {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;

  constructor(refreshToken: RefreshTokenPayload & { token: string }) {
    this.userId = refreshToken.userId;
    this.token = refreshToken.token;
    this.expiresAt = refreshToken.expiresAt;
    this.createdAt = refreshToken.createdAt;
  }
}
