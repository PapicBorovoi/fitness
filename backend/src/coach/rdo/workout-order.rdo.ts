import { Expose } from 'class-transformer';
import { WorkoutRdo } from './workout.rdo';

export class WorkoutOrderRdo {
  @Expose()
  workout: WorkoutRdo;

  @Expose()
  bougthAmount: number;

  @Expose()
  earned: number;
}
