export type Token = {
  accesToken: string;
  refreshToken: string;
};

export type TokenData = {
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type AccessTokenPayload = {
  userId: string;
  name: string;
  email: string;
  avatarUri: string;
  backgroudUri: string;
};

export type RefreshTokenPayload = {
  userId: string;
  createdAt: Date;
  expiresAt: Date;
};

export interface RequestWithAccessPayload extends Request {
  user: AccessTokenPayload;
}

export interface RequestWithRefreshPayload extends Request {
  user: RefreshTokenPayload;
}
