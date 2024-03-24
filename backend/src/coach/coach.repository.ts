import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { WorkoutEntity } from './entities/workout.entity';
import { randomUUID } from 'node:crypto';
import { WorkoutRow } from 'src/shared/types/db.interface';
import { QueryDto } from './dto/query.dto';

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

  public async readWorkouts(
    userId: string,
    options?: {
      filter?: QueryDto;
      limit?: number;
      offset?: number;
    },
  ) {
    let query = 'SELECT * FROM workouts WHERE coach_id = $1';

    const values = [userId];

    if (options.filter) {
      const {
        priceTo,
        priceFrom,
        caloriesTo,
        caloriesFrom,
        workoutTime,
        rating,
      } = options.filter;

      if (priceFrom > priceTo) {
        throw new BadRequestException(
          'priceFrom cannot be greater than priceTo',
        );
      }

      if (caloriesFrom > caloriesTo) {
        throw new BadRequestException(
          'caloriesFrom cannot be greater than caloriesTo',
        );
      }

      if (priceFrom) {
        query += ` AND (price >= $${values.length + 1})`;
        values.push(priceFrom.toString());
      }

      if (priceTo) {
        query += ` AND (price <= $${values.length + 1})`;
        values.push(priceTo.toString());
      }

      if (caloriesFrom) {
        query += ` AND (calories >= $${values.length + 1})`;
        values.push(caloriesFrom.toString());
      }

      if (caloriesTo) {
        query += ` AND (calories <= $${values.length + 1})`;
        values.push(caloriesTo.toString());
      }

      if (rating) {
        query += ` AND (rating = $${values.length + 1})`;
        values.push(rating.toString());
      }

      if (workoutTime) {
        const valuesArray = [...Array(workoutTime.length).keys()].map(
          (key) => key + 1 + values.length,
        );

        query += ` AND (workout_time IN ($${valuesArray.join(',$')}))`;
        values.push(...workoutTime);
      }
    }

    if (options.limit) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(options.limit.toString());
    }

    if (options.offset) {
      query += ` OFFSET $${values.length + 1}`;
      values.push(options.offset.toString());
    }

    const { rows } = await this.pool.query<WorkoutRow>(query, values);

    if (rows.length === 0) {
      return null;
    }

    const workouts: WorkoutEntity[] = rows.map((row) =>
      this.createWorkoutEntity(row),
    );

    return workouts;
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
