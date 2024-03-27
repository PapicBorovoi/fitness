import { WorkoutEntity } from 'src/coach/entities/workout.entity';

export class BalanceEntity {
  id?: string;
  workouts: { workout: WorkoutEntity; num: number }[];

  constructor(balance: BalanceEntity) {
    Object.assign(this, balance);
  }
}
