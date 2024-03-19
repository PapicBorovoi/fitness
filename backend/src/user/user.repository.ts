import { Pool } from 'pg';
import { UserEntity } from './entities/user.entity';
import {
  Gender as GenderType,
  MetroStation as MetroType,
  Role as RoleType,
} from '../shared/types/app.type';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Inject } from '@nestjs/common';

export class UserRepository {
  constructor(
    private readonly configService: ConfigService,
    @Inject('DATABASE_POOL') private readonly pool: Pool,
  ) {}

  public async create(userEntity: UserEntity): Promise<UserEntity | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [userEntity.email],
    );

    if (rows.length > 0) {
      return null;
    }

    const id = crypto.randomUUID();

    const {
      rows: [user],
    } = await this.pool.query(
      'INSERT INTO users (id, email, name, gender, location, role, birthday, password_hash, avatar_uri, description, background_uri) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        id,
        userEntity.email,
        userEntity.name,
        userEntity.gender,
        userEntity.location,
        userEntity.roleType,
        userEntity.birthday ? userEntity.birthday.toISOString() : null,
        userEntity.passwordHash,
        userEntity.avatarUri || 'default.png',
        userEntity.description,
        userEntity.backgroundUri,
      ],
    );

    return new UserEntity({
      ...user,
      gender: user.gender as GenderType,
      avatarUri: user.avatar_uri,
      location: user.location as MetroType,
      roleType: user.role as RoleType,
      backgroundUri: user.background_uri,
      birthday: user.birthday,
      role: undefined,
      password: undefined,
    });
  }

  public async read(options: {
    email?: string;
    id?: string;
  }): Promise<UserEntity | null> {
    let query = 'SELECT * FROM users WHERE';
    const values = [];

    if (options.email) {
      query += ' email = $1';
      values.push(options.email);
    } else if (options.id) {
      query += ' id = $1';
      values.push(options.id);
    } else {
      return null;
    }

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return new UserEntity({
      ...user,
      avatarUri: user.avatar_uri,
      backgroundUri: user.background_uri,
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
    const {
      rows: [token],
    } = await this.pool.query(
      'INSERT INTO refresh_tokens (user_id, created_at, expires_at, token) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        refreshToken.userId,
        refreshToken.createdAt.toISOString(),
        refreshToken.expiresAt.toISOString(),
        refreshToken.token,
      ],
    );

    return new RefreshTokenEntity({
      userId: token.user_id,
      token: token.token,
      createdAt: token.created_at,
      expiresAt: token.expires_at,
    });
  }

  public async readRefreshToken(
    userId: string,
  ): Promise<RefreshTokenEntity | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM refresh_tokens WHERE user_id = $1',
      [userId],
    );

    if (rows.length === 0) {
      return null;
    }

    return new RefreshTokenEntity({
      userId: rows[0].user_id,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      createdAt: rows[0].createdAt,
    });
  }

  public async deleteRefreshToken(
    userId: string,
  ): Promise<RefreshTokenEntity | null> {
    const { rows } = await this.pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [userId],
    );

    if (rows.length === 0) {
      return null;
    }

    return new RefreshTokenEntity({
      userId: rows[0].user_id,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      createdAt: rows[0].createdAt,
    });
  }
}
