import { Expose, Type } from 'class-transformer';
import { WorkoutWithNumRdo } from './workout-with-num.rdo';

export class UserBalanceRdo {
  @Expose()
  id: string;

  @Expose()
  @Type(() => WorkoutWithNumRdo)
  workouts: Array<WorkoutWithNumRdo>;
}
