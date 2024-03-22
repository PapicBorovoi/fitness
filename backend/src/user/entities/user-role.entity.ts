import {
  Skill,
  UserRole,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class UserRoleEntity implements UserRole {
  skill: Skill;
  workoutTime: WorkoutTime;
  workoutType: WorkoutType;
  caloriesToSpend: number;
  caloriesToBurn: number;
  isReadyForWorkout: boolean;

  constructor(userRole: UserRole) {
    this.skill = userRole.skill;
    this.workoutType = userRole.workoutType;
    this.workoutTime = userRole.workoutTime;
    this.caloriesToBurn = userRole.caloriesToBurn;
    this.caloriesToSpend = userRole.caloriesToSpend;
    this.isReadyForWorkout = userRole.isReadyForWorkout;
  }

  toPojo() {
    return {
      skill: this.skill,
      workoutTime: this.workoutTime,
      workoutType: this.workoutType,
      caloriesToBurn: this.caloriesToBurn,
      caloriesToSpend: this.caloriesToSpend,
      isReadyForWorkout: this.isReadyForWorkout,
    };
  }
}
