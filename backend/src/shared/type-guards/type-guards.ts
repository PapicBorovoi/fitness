import { CoachRole, UserRole } from '../types/app.type';

export function isUserRole(role: UserRole | CoachRole): role is UserRole {
  return (role as UserRole).isReadyForWorkout !== undefined;
}

export function isCoachRole(role: UserRole | CoachRole): role is CoachRole {
  return (role as CoachRole).isReadyToCoach !== undefined;
}
