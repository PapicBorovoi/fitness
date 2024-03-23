import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { WorkoutEntity } from './entities/workout.entity';
import { randomUUID } from 'node:crypto';
import { WorkoutRow } from 'src/shared/types/db.interface';

@Injectable()
export class CoachRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  public async createWorkout(
    workout: WorkoutEntity,
  ): Promise<WorkoutEntity | null> {
    const query = `
      INSERT INTO workouts (id, name, background_uri, skill,
      workout_type, workout_time, price, calories,
      description, gender, video_uri, rating, coach_id, is_special_offer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const id = randomUUID();

    const values = [
      id,
      workout.name,
      workout.backgroundUri,
      workout.skill,
      workout.workoutType,
      workout.workoutTime,
      workout.price.toString(),
      workout.calories.toString(),
      workout.description,
      workout.gender,
      workout.videoUri,
      workout.rating.toString(),
      workout.coachId,
      workout.isSpecialOffer.toString(),
    ];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    const nw: WorkoutRow = rows[0];

    return new WorkoutEntity({
      ...nw,
      videoUri: nw.video_url,
      workoutTime: nw.workout_time,
      workoutType: nw.workout_type,
      backgroundUri: nw.background_uri,
      isSpecialOffer: nw.is_special_offer,
      coachId: nw.coach_id,
    });
  }
}
