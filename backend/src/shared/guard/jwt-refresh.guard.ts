import { AuthGuard } from '@nestjs/passport';

export class JWTRefreshGuard extends AuthGuard('jwt-refresh') {}
