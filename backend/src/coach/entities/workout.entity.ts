import {
  Skill,
  TargetGender,
  Workout,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class WorkoutEntity implements Omit<Workout, 'coach'> {
  id?: string;
  name: string;
  backgroundUri: string;
  skill: Skill;
  workoutTime: WorkoutTime;
  workoutType: WorkoutType;
  price: number;
  calories: number;
  description: string;
  gender: TargetGender;
  videoUri: string;
  coachId: string;
  rating: number;
  isSpecialOffer: boolean;

  constructor(workout: WorkoutEntity) {
    Object.assign(this, workout);
  }
}
