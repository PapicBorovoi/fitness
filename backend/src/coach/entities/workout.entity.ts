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

  constructor(workout: Omit<WorkoutEntity, 'toPojo'>) {
    Object.assign(this, workout);
  }

  toPojo() {
    return {
      id: this.id,
      name: this.name,
      backgroundUri: this.backgroundUri,
      skill: this.skill,
      workoutTime: this.workoutTime,
      workoutType: this.workoutType,
      price: this.price,
      calories: this.calories,
      description: this.description,
      gender: this.gender,
      videoUri: this.videoUri,
      coachId: this.coachId,
      rating: this.rating,
      isSpecialOffer: this.isSpecialOffer,
    };
  }
}
