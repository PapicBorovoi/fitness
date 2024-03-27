import { Expose, Type } from 'class-transformer';
import { WorkoutRdo } from 'src/coach/rdo/workout.rdo';

export class WorkoutWithNumRdo {
  @Expose()
  @Type(() => WorkoutRdo)
  workout: WorkoutRdo;

  @Expose()
  num: number;
}
