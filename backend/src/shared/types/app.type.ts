export type User = {
  id?: string;
  name: string;
  email: string;
  avatarUri: string;
  password: string;
  sex: Gender;
  birthday: Date;
  role: UserRole | CoachRole;
  description: string;
  location: MetroStation;
  backgroundUri: string;
};

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum MetroStation {
  Pionerskaya = 'pionerskaya',
  Petrogradskaya = 'petrogradskaya',
  Udelnaya = 'udelnaya',
  Zvezdnaya = 'zvezdnaya',
  Sportivnaya = 'sportivnaya',
}

export type UserRole = {
  skill: Skill;
  workoutType: WorkoutType;
  workoutTime: WorkoutTime;
  caloriesToBurn: number;
  caloriesToSpend: number;
  isReadyForworkout: boolean;
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
}

export enum WorkoutTime {
  ExtraFast = '10-30',
  Fast = '30-50',
  Medium = '50-80',
  Long = '80-100',
}

export type CoachRole = {
  skill: Skill;
  workoutType: WorkoutType;
  sertifikatUri: string;
  merits: string;
  isReadyToTrain: boolean;
};

export enum TargetGender {
  ForMale = 'for male',
  ForFemale = 'for female',
  ForBoth = 'for both',
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
  sex: TargetGender;
  videoUri: string;
  rating: number;
  trainer: User;
  isSpecialOffer: boolean;
};

export type Review = {
  id?: string;
  author: User;
  workoutID: string;
  rating: number;
  description: string;
  date: Date;
};

export type Order = {
  id?: string;
  orderType: string;
  workoutID: string;
  pricePerworkout: number;
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
  ForConsideration = 'for consideration',
}

export type Personalworkout = {
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
  userID?: string;
  purchasedWorkouts: { workout: Workout; num: number }[];
};
