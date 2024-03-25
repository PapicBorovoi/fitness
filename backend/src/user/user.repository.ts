import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserEntity } from 'src/auth/entities/user.entity';
import { UserWithRolesRow } from 'src/shared/types/db.interface';
import { fillRole } from 'src/shared/util/db';
import { randomUUID } from 'node:crypto';

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
}
