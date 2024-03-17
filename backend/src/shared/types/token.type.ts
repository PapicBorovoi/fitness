export type Token = {
  accesToken: string;
  refreshToken: string;
}

export type AccessTokenPayload = {
  id: string;
  name: string;
  email: string;
  avatarUri: string;
  backgroudUri: string;
}

export type RefreshTokenPayload = {
  id: string;
}
