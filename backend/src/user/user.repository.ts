import { Pool } from 'pg';
import { UserEntity } from './entities/user.entity';
import { CoachRole, UserRole, Role } from '../shared/types/app.type';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Inject, Logger } from '@nestjs/common';
import { UserRoleEntity } from './entities/user-role.entity';
import { CoachRoleEntity } from './entities/coach-role.entity';
import { isCoachRole, isUserRole } from 'src/shared/type-guards/type-guards';
import {
  CoachRoleRow,
  UserRoleRow,
  UserRow,
  UserWithRolesRow,
} from 'src/shared/types/db.interface';
import { GetUsersQuery } from './user.type';

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
    } = await this.pool.query<UserRow>(
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
      avatarUri: user.avatar_uri,
      roleType: user.role,
      backgroundUri: user.background_uri,
      role: undefined,
    });
  }

  public async read(options: {
    email?: string;
    id?: string;
  }): Promise<UserEntity | null> {
    let query = `
  SELECT 
    u.*, 
    ur.skill user_skill, 
    ur.workout_type user_workout_type, 
    ur.workout_time user_workout_time, 
    ur.calories_to_burn user_calories_to_burn, 
    ur.calories_to_spend user_calories_to_spend, 
    ur.is_ready_for_workout user_is_ready_for_workout,
    cr.skill coach_skill,
    cr.workout_type coach_workout_type,
    cr.sertifikat_uri coach_sertifikat_uri,
    cr.merits coach_merits,
    cr.is_ready_to_coach coach_is_ready_to_coach
  FROM 
    users u
    LEFT JOIN users_role ur ON u.id = ur.user_id
    LEFT JOIN coaches_role cr ON u.id = cr.user_id
  WHERE
`;
    const values = [];

    if (options.email) {
      query += ' u.email = $1';
      values.push(options.email);
    } else if (options.id) {
      query += ' u.id = $1';
      values.push(options.id);
    } else {
      return null;
    }

    const { rows } = await this.pool.query<UserWithRolesRow>(query, values);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    const role = this.fillRole(user);

    return new UserEntity(
      {
        ...user,
        backgroundUri: user.background_uri,
        avatarUri: user.avatar_uri,
        roleType: user.role,
        role: role ?? undefined,
      },
      user.password_hash,
    );
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

  public async createUserRole(
    userId: string,
    userRole: UserRoleEntity,
  ): Promise<UserRoleEntity | null> {
    const values = [
      userId,
      userRole.skill,
      userRole.workoutType,
      userRole.workoutTime,
      userRole.caloriesToBurn.toString(),
      userRole.caloriesToSpend.toString(),
      userRole.isReadyForWorkout.toString(),
    ];

    const { rows } = await this.pool.query<UserRoleRow>(
      'INSERT INTO users_role (user_id, skill, workout_type, workout_time, calories_to_burn, calories_to_spend, is_ready_for_workout) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values,
    );

    if (rows.length === 0) {
      return null;
    }

    const ur = rows[0];

    return new UserRoleEntity({
      skill: ur.skill,
      workoutType: ur.workout_type,
      workoutTime: ur.workout_time,
      caloriesToBurn: ur.calories_to_burn,
      caloriesToSpend: ur.calories_to_spend,
      isReadyForWorkout: ur.is_ready_for_workout,
    });
  }

  public async createCoachRole(
    userId: string,
    coachRole: CoachRoleEntity,
  ): Promise<CoachRoleEntity | null> {
    const values = [
      userId,
      coachRole.skill,
      coachRole.workoutType,
      coachRole.sertifikatUri,
      coachRole.merits,
      coachRole.isReadyToCoach.toString(),
    ];

    const { rows } = await this.pool.query<CoachRoleRow>(
      'INSERT INTO coaches_role (user_id, skill, workout_type, sertifikat_uri, merits, is_ready_to_coach) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values,
    );

    if (rows.length === 0) {
      return null;
    }

    const cr = rows[0];

    return new CoachRoleEntity({
      ...cr,
      workoutType: cr.workout_type,
      sertifikatUri: cr.sertifikat_uri,
      isReadyToCoach: cr.is_ready_to_coach,
    });
  }

  public async update(
    userId: string,
    updateUser: UserEntity,
    whatRoleToUpdate: Role | undefined,
  ) {
    const client = await this.pool.connect();
    let userEntity: UserEntity;

    try {
      await client.query('BEGIN');

      let query = `
      UPDATE users
      SET name = ($1), avatar_uri = ($2), gender = ($3), birthday = ($4), description = ($5), location = ($6), background_uri = ($7)
      WHERE id = ($8)
      RETURNING *
    `;

      const { rows } = await client.query<UserRow>(query, [
        updateUser.name,
        updateUser.avatarUri,
        updateUser.gender,
        updateUser.birthday ? updateUser.birthday.toISOString() : null,
        updateUser.description,
        updateUser.location,
        updateUser.backgroundUri,
        userId,
      ]);

      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];

      userEntity = new UserEntity({
        ...user,
        backgroundUri: user.background_uri,
        avatarUri: user.avatar_uri,
        roleType: user.role,
        role: undefined,
      });

      if (whatRoleToUpdate === Role.User && isUserRole(updateUser.role)) {
        query = `
          UPDATE users_role
          SET skill = $1, workout_type = $2, workout_time = $3, calories_to_burn = $4, calories_to_spend = $5, is_ready_for_workout = $6
          WHERE user_id = $7
          RETURNING *
        `;

        const {
          rows: [userRole],
        } = await client.query<UserRoleRow>(query, [
          updateUser.role.skill,
          updateUser.role.workoutType,
          updateUser.role.workoutTime,
          updateUser.role.caloriesToBurn.toString(),
          updateUser.role.caloriesToSpend.toString(),
          updateUser.role.isReadyForWorkout.toString(),
          userId,
        ]);

        userEntity.role = {
          skill: userRole.skill,
          workoutTime: userRole.workout_time,
          workoutType: userRole.workout_type,
          caloriesToSpend: userRole.calories_to_spend,
          caloriesToBurn: userRole.calories_to_burn,
          isReadyForWorkout: userRole.is_ready_for_workout,
        } as UserRole;
      } else if (
        whatRoleToUpdate === Role.Coach &&
        isCoachRole(updateUser.role)
      ) {
        query = `
          UPDATE coaches_role
          SET skill = $1, workout_type = $2, sertifikat_uri = $3, merits = $4, is_ready_to_coach = $5
          WHERE user_id = $6
          RETURNING *
        `;

        const {
          rows: [coachRole],
        } = await client.query<CoachRoleRow>(query, [
          updateUser.role.skill,
          updateUser.role.workoutType,
          updateUser.role.sertifikatUri,
          updateUser.role.merits,
          updateUser.role.isReadyToCoach.toString(),
          userId,
        ]);

        userEntity.role = {
          skill: coachRole.skill,
          workoutType: coachRole.workout_type,
          sertifikatUri: coachRole.sertifikat_uri,
          merits: coachRole.merits,
          isReadyToCoach: coachRole.is_ready_to_coach,
        } as CoachRole;
      }

      await client.query('COMMIT');

      return userEntity;
    } catch (error) {
      Logger.error(error);
      await client.query('ROLLBACK');
      return null;
    } finally {
      client.release();
      return userEntity;
    }
  }

  public async readUsers(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      filters?: GetUsersQuery;
    },
  ): Promise<UserEntity[] | null> {
    let query = `
    SELECT
      u.*,
      ur.skill user_skill,
      ur.workout_type user_workout_type,
      ur.workout_time user_workout_time,
      ur.calories_to_burn user_calories_to_burn,
      ur.calories_to_spend user_calories_to_spend,
      ur.is_ready_for_workout user_is_ready_for_workout,
      cr.skill coach_skill,
      cr.workout_type coach_workout_type,
      cr.sertifikat_uri coach_sertifikat_uri,
      cr.merits coach_merits,
      cr.is_ready_to_coach coach_is_ready_to_coach
    FROM
      users u
      LEFT JOIN users_role ur ON u.id = ur.user_id
      LEFT JOIN coaches_role cr ON u.id = cr.user_id
  `;

    const values: string[] = [];
    let whereClause = ' WHERE id != $1';
    values.push(userId);

    if (options.filters) {
      const { skill, workoutType, role, location } = options.filters;

      if (skill) {
        whereClause += ` AND (ur.skill = $${values.length + 1} OR cr.skill = $${values.length + 1})`;
        values.push(skill);
      }

      if (workoutType) {
        whereClause += ` AND (ur.workout_type = $${values.length + 1} OR cr.workout_type = $${values.length + 1})`;
        values.push(workoutType);
      }

      if (role) {
        whereClause += ` AND u.role = $${values.length + 1}`;
        values.push(role);
      }

      if (location) {
        whereClause += ` AND u.location = $${values.length + 1}`;
        values.push(location);
      }
    }

    query += whereClause;

    if (options.limit !== undefined) {
      query += ' LIMIT $' + (values.length + 1);
      values.push(options.limit.toString());
    }

    if (options.offset !== undefined) {
      query += ' OFFSET $' + (values.length + 1);
      values.push(options.offset.toString());
    }

    const { rows } = await this.pool.query<UserWithRolesRow>(query, values);

    if (rows.length === 0) {
      return null;
    }

    const users: UserEntity[] = rows.map((row) => {
      const role = this.fillRole(row);

      return new UserEntity({
        ...row,
        backgroundUri: row.background_uri,
        avatarUri: row.avatar_uri,
        roleType: row.role,
        role: role ?? undefined,
      });
    });

    return users;
  }

  private fillRole(row: UserWithRolesRow): UserRole | CoachRole | null {
    if (row.user_skill) {
      return {
        skill: row.user_skill,
        workoutType: row.user_workout_type!,
        workoutTime: row.user_workout_time!,
        caloriesToBurn: row.user_calories_to_burn!,
        caloriesToSpend: row.user_calories_to_spend!,
        isReadyForWorkout: row.user_is_ready_for_workout!,
      };
    } else if (row.coach_skill) {
      return {
        skill: row.coach_skill,
        workoutType: row.coach_workout_type!,
        sertifikatUri: row.coach_sertifikat_uri!,
        merits: row.coach_merits!,
        isReadyToCoach: row.coach_is_ready_to_coach!,
      };
    }
    return null;
  }
}
