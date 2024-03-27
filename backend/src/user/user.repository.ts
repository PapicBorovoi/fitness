import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserEntity } from 'src/auth/entities/user.entity';
import { UserWithRolesRow, WorkoutRow } from 'src/shared/types/db.interface';
import { createWorkoutEntity, fillRole } from 'src/shared/util/db';
import { randomUUID } from 'node:crypto';
import { BalanceEntity } from './entities/balance.entity';

@Injectable()
export class UserRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  public async readFriends(userId: string, isFriendOf: boolean) {
    const query = `
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
         friends f
         JOIN users u ON ${isFriendOf ? 'f.owner_id' : 'f.friend_id'} = u.id
         LEFT JOIN users_role ur ON u.id = ur.user_id
         LEFT JOIN coaches_role cr ON u.id = cr.user_id
       WHERE ${isFriendOf ? 'f.friend_id' : 'f.owner_id'} = $1
    `;

    const values = [userId];

    const { rows } = await this.pool.query<UserWithRolesRow>(query, values);

    const users: UserEntity[] = rows.map(
      (row) =>
        new UserEntity({
          ...row,
          role: fillRole(row) ?? undefined,
          backgroundUri: row.background_uri,
          avatarUri: row.avatar_uri,
          roleType: row.role,
        }),
    );

    return users;
  }

  public async createFriend(userId: string, friendId: string) {
    const query = `
      INSERT INTO friends(id, owner_id, friend_id)
      VALUES ($1, $2, $3)
    `;

    const id = randomUUID();

    const values = [id, userId, friendId];

    const { rows } = await this.pool.query(query, values);

    console.log(rows);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  public async deleteFriend(userId: string, friendId: string) {
    const query = `
      DELETE FROM friends
      WHERE owner_id = $1 AND friend_id = $2
      RETURNING *
    `;

    const values = [userId, friendId];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  public async readBalance(userId: string) {
    const query = `
      SELECT
        ub.id balance_id,
        w.*,
        pw.num num
      FROM
        users_balances ub
        LEFT JOIN purchased_workouts_by_user pw ON pw.balance_id = ub.id
        LEFT JOIN workouts w ON w.id = pw.workout_id
      WHERE ub.user_id = $1 
    `;

    const values = [userId];

    const { rows } = await this.pool.query<
      WorkoutRow & { num: number; balance_id: string }
    >(query, values);

    if (rows.length === 0) {
      return null;
    }

    const workoutsWithNum = rows.map((row) => ({
      workout: createWorkoutEntity(row),
      num: row.num,
    }));

    const result = new BalanceEntity({
      id: rows[0].balance_id,
      workouts:
        workoutsWithNum.length === 1 && workoutsWithNum[0].num === null
          ? []
          : workoutsWithNum,
    });

    return result;
  }

  public async updateBalance(
    balanceId: string,
    workoutId: string,
    num: number,
  ) {
    const query = `
      UPDATE purchased_workouts_by_user
      SET num = num + $3
      WHERE balance_id = $1 AND workout_id = $2
      RETURNING *
    `;

    const values = [balanceId, workoutId, num.toString()];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  public async addWorkoutToBalance(
    balance_id: string,
    workoutId: string,
    num: number,
  ) {
    const query = `
      INSERT INTO purchased_workouts_by_user(id, balance_id, workout_id, num)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const id = randomUUID();

    const values = [id, balance_id, workoutId, num.toString()];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  public async deleteWorkoutFromBalance(balanceId: string, workoutId: string) {
    const query = `
      DELETE FROM purchased_workouts_by_user
      WHERE balance_id = $1 AND workout_id = $2
      RETURNING *
    `;

    const values = [balanceId, workoutId];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
