import { CoachRole, Skill, WorkoutType } from 'src/shared/types/app.type';

export class CoachRoleEntity implements CoachRole {
  skill: Skill;
  workoutType: WorkoutType;
  sertifikatUri: string;
  merits: string;
  isReadyToCoach: boolean;

  constructor(coachRole: CoachRole) {
    this.skill = coachRole.skill;
    this.workoutType = coachRole.workoutType;
    this.sertifikatUri = coachRole.sertifikatUri;
    this.merits = coachRole.merits;
    this.isReadyToCoach = coachRole.isReadyToCoach;
  }

  toPojo() {
    return {
      skill: this.skill,
      workoutType: this.workoutType,
      sertifikatUri: this.sertifikatUri,
      merits: this.merits,
      isReadyToCoach: this.isReadyToCoach,
    };
  }
}
