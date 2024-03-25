import { UserWithRolesRow } from '../types/db.interface';
import { UserRole, CoachRole } from '../types/app.type';

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
