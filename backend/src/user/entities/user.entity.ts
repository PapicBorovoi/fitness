import {
  Gender,
  MetroStation,
  Role,
  User,
  CoachRole,
  UserRole,
} from '../../shared/types/app.type';
import { compare, genSalt, hash } from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserEntity implements Omit<User, 'password'> {
  id?: string;
  name: string;
  email: string;
  avatarUri: string;
  gender: Gender;
  birthday?: Date;
  roleType: Role;
  description: string;
  location: MetroStation;
  backgroundUri: string;
  role?: UserRole | CoachRole;
  passwordHash?: string = '';

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.avatarUri = user.avatarUri;
    this.gender = user.gender;
    this.birthday = user.birthday;
    this.roleType = user.roleType;
    this.description = user.description;
    this.location = user.location;
    this.backgroundUri = user.backgroundUri;
    this.role = user.role;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.passwordHash);
  }
}
