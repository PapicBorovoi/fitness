import { UserEntity } from './entities/user.entity';
import {
  Gender,
  MetroStation,
  Role,
  User,
} from '../../node_modules/.prisma/client';
import {
  Gender as GenderType,
  MetroStation as MetroType,
  Role as RoleType,
} from '../shared/types/app.type';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

export class UserRepository {
  constructor(private readonly configService: ConfigService) {}

  public async create(userEntity: UserEntity): Promise<UserEntity | null> {
    if (
      await this.prisma.user.findFirst({
        where: {
          email: userEntity.email,
        },
      })
    ) {
      return null;
    }

    const user = await this.prisma.user.create({
      data: {
        ...userEntity,
        gender: userEntity.gender as Gender,
        location: userEntity.location as MetroStation,
        role: userEntity.roleType as Role,
        birthday: userEntity.birthday,
        passwordHash: userEntity.passwordHash,
      },
    });

    return new UserEntity({
      ...user,
      gender: user.gender as GenderType,
      location: user.location as MetroType,
      roleType: user.role as RoleType,
      birthday: user.birthday,
      role: undefined,
      password: undefined,
    });
  }

  public async read(options: {
    email?: string;
    id?: string;
  }): Promise<UserEntity | null> {
    let user: User;

    if (options.email) {
      user = await this.prisma.user.findFirst({
        where: {
          email: options.email,
        },
      });
    } else if (options.id) {
      user = await this.prisma.user.findFirst({
        where: {
          id: options.id,
        },
      });
    } else {
      return null;
    }

    return new UserEntity({
      ...user,
      gender: user.gender as GenderType,
      location: user.location as MetroType,
      roleType: user.role as RoleType,
      birthday: user.birthday,
      role: undefined,
      password: undefined,
    });
  }

  public async createRefreshToken(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity | null> {
    if (
      await this.prisma.refreshToken.findFirst({
        where: { userId: refreshToken.userId },
      })
    ) {
      return null;
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() * 86_400_000 * 7);

    const token = await this.prisma.refreshToken.create({
      data: {
        user: {
          connect: {
            id: refreshToken.userId,
          },
        },
        createdAt,
        expiresAt,
      },
    });

    return new RefreshTokenEntity(token);
  }
}
