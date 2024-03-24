import {
  Role,
  Gender,
  MetroStation,
  WorkoutType,
  WorkoutTime,
  Skill,
  TargetGender,
} from './app.type';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  location: MetroStation;
  role: Role;
  birthday: Date | null;
  password_hash: string;
  avatar_uri: string;
  description: string;
  background_uri: string;
}

export interface UserRoleRow {
  user_id: string;
  skill: Skill;
  workout_type: WorkoutType;
  workout_time: WorkoutTime;
  calories_to_burn: number;
  calories_to_spend: number;
  is_ready_for_workout: boolean;
}

export interface CoachRoleRow {
  user_id: string;
  skill: Skill;
  workout_type: WorkoutType;
  sertifikat_uri: string;
  merits: string;
  is_ready_to_coach: boolean;
}

export interface UserWithRolesRow {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  location: MetroStation;
  role: Role;
  birthday: Date | null;
  password_hash: string;
  avatar_uri: string;
  description: string;
  background_uri: string;
  user_skill: Skill | null;
  user_workout_type: WorkoutType | null;
  user_workout_time: WorkoutTime | null;
  user_calories_to_burn: number | null;
  user_calories_to_spend: number | null;
  user_is_ready_for_workout: boolean | null;
  coach_skill: Skill | null;
  coach_workout_type: WorkoutType | null;
  coach_sertifikat_uri: string | null;
  coach_merits: string | null;
  coach_is_ready_to_coach: boolean | null;
}

export interface WorkoutRow {
  id: string;
  name: string;
  background_uri: string;
  skill: Skill;
  workout_type: WorkoutType;
  workout_time: WorkoutTime;
  price: number;
  calories: number;
  description: string;
  gender: TargetGender;
  video_uri: string;
  rating: number;
  coach_id: string;
  is_special_offer: boolean;
}
