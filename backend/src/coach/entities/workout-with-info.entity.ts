import { WorkoutEntity } from './workout.entity';

export class WorkoutWithInfoEntity {
  workout: WorkoutEntity;
  bougthAmount: number;
  earned: number;

  constructor(workout: WorkoutWithInfoEntity) {
    Object.assign(this, workout);
  }
}
