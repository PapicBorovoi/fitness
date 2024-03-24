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

    return this.createWorkoutEntity(nw);
  }

  public async readWorkout(id: string): Promise<WorkoutEntity | null> {
    const query = `
      SELECT * FROM workouts WHERE id = $1
    `;

    const values = [id];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    const workout: WorkoutRow = rows[0];

    return this.createWorkoutEntity(workout);
  }

  public async updateWorkout(uw: WorkoutEntity): Promise<WorkoutEntity | null> {
    const query = `
      UPDATE workouts
      SET name = $1, background_uri = $2, skill = $3,  workout_type = $4, 
      workout_time = $5, price = $6, calories = $7, description = $8, 
      gender = $9, video_uri = $10, is_special_offer = $11
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      uw.name,
      uw.backgroundUri,
      uw.skill,
      uw.workoutType,
      uw.workoutTime,
      uw.price.toString(),
      uw.calories.toString(),
      uw.description,
      uw.gender,
      uw.videoUri,
      uw.isSpecialOffer.toString(),
      uw.id,
    ];

    const { rows } = await this.pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    const workout: WorkoutRow = rows[0];

    return this.createWorkoutEntity(workout);
  }

  private createWorkoutEntity(workout: WorkoutRow) {
    return new WorkoutEntity({
      ...workout,
      videoUri: workout.video_uri,
      workoutTime: workout.workout_time,
      workoutType: workout.workout_type,
      backgroundUri: workout.background_uri,
      isSpecialOffer: workout.is_special_offer,
      coachId: workout.coach_id,
    });
  }
}
