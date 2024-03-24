import {
  MetroStation,
  Role,
  Skill,
  WorkoutType,
} from 'src/shared/types/app.type';

export interface GetUsersQuery {
  skill?: Skill;
  workoutType?: WorkoutType;
  role?: Role;
  location?: MetroStation;
}
