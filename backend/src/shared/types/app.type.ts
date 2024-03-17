export type User = {
  id?: string;
  name: string;
  email: string;
  avatarUri: string;
  password: string;
  gender: Gender;
  birthday?: Date;
  role: UserRole | CoachRole;
  description: string;
  location: MetroStation;
  backgroundUri: string;
};

export enum Gender {
  Male = 'male',
  Female = 'female',
  NotSpecified = 'not_specified',
}

export enum MetroStation {
  Pionerskaya = 'pionerskaya',
  Petrogradskaya = 'petrogradskaya',
  Udelnaya = 'udelnaya',
  Zvezdnaya = 'zvezdnaya',
  Sportivnaya = 'sportivnaya',
}

export enum Role {
  User = 'user',
  Coach = 'coach',
}

export type UserRole = {
  skill: Skill;
  workoutType: WorkoutType;
  workoutTime: WorkoutTime;
  caloriesToBurn: number;
  caloriesToSpend: number;
  isReadyForWorkout: boolean;
};

export enum Skill {
  Newbie = 'newbie',
  Average = 'average',
  Professional = 'professional',
}

export enum WorkoutType {
  Yoga = 'yoga',
  Running = 'running',
  Boxing = 'boxing',
  Stretching = 'stretching',
  Crossfit = 'crossfit',
  Aerobics = 'aerobics',
  Pilates = 'pilates',
  Strength = 'strength',
}

export enum WorkoutTime {
  ExtraFast = 'extra_fast',
  Fast = 'fast',
  Medium = 'medium',
  Long = 'long',
}

export type CoachRole = {
  skill: Skill;
  workoutType: WorkoutType;
  sertifikatUri: string;
  merits: string;
  isReadyToCoach: boolean;
};

export enum TargetGender {
  ForMale = 'for_male',
  ForFemale = 'for_female',
  ForBoth = 'for_both',
}

export type Workout = {
  id?: string;
  name: string;
  backgroundUri: string;
  skill: Skill;
  workoutType: WorkoutType;
  workoutTime: WorkoutTime;
  price: number;
  calories: number;
  description: string;
  gender: TargetGender;
  videoUri: string;
  rating: number;
  coach: User;
  isSpecialOffer: boolean;
};

export type Review = {
  id?: string;
  author: User;
  workout: Workout;
  rating: number;
  description: string;
  date: Date;
};

export type Order = {
  id?: string;
  orderType: string;
  user: User;
  workout: Workout;
  pricePerWorkout: number;
  fullPrice: number;
  paymentMethod: PaymentMethod;
};

export enum PaymentMethod {
  Visa = 'visa',
  Mir = 'mir',
  Umoney = 'umoney',
}

export enum Status {
  Accepted = 'accepted',
  Rejected = 'rejected',
  ForConsideration = 'for_consideration',
}

export type PersonalWorkout = {
  id?: string;
  author: User;
  partner: User;
  date: Date;
  updateDate: Date;
  status: Status;
};

export type Notify = {
  id?: string;
  date: Date;
  user: User;
  text: string;
};

export type UserBalance = {
  id?: string;
  user: User;
  purchasedWorkouts: { workout: Workout; num: number }[];
};
