import { UserWithRolesRow } from '../types/db.interface';
import { UserRole, CoachRole } from '../types/app.type';
import { WorkoutRow } from '../types/db.interface';
import { WorkoutEntity } from 'src/coach/entities/workout.entity';

export const fillRole = (
  row: UserWithRolesRow,
): UserRole | CoachRole | null => {
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
};

export const createWorkoutEntity = (workout: WorkoutRow) => {
  return new WorkoutEntity({
    ...workout,
    videoUri: workout.video_uri,
    workoutTime: workout.workout_time,
    workoutType: workout.workout_type,
    backgroundUri: workout.background_uri,
    isSpecialOffer: workout.is_special_offer,
    coachId: workout.coach_id,
  });
};
