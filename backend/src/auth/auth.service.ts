import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/shared/types/token.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Gender, MetroStation, Role } from '../shared/types/app.type';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoleEntity } from './entities/user-role.entity';
import { CoachRoleEntity } from './entities/coach-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { isUserRole, isCoachRole } from 'src/shared/type-guards/type-guards';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from './auth.const';
import { QueryDto } from './dto/query.dto';

const USER_ROLE_PROPERTIES = [
  'caloriesToSpend',
  'caloriesToBurn',
  'isReadyForWorkout',
  'workoutTime',
];
const COACH_ROLE_PROPERTIES = ['sertifikatUri', 'isReadyToCoach', 'merits'];

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async check(payload: AccessTokenPayload) {
    const foundUser = await this.authRepository.read({
      email: payload.email,
      id: payload.userId,
    });

    if (!foundUser) {
      throw new UnauthorizedException('No user found');
    }

    return foundUser;
  }

  public async register(createUserDto: CreateUserDto) {
    const userEntity = await new UserEntity({
      ...createUserDto,
      gender: createUserDto.gender as Gender,
      location: createUserDto.location as MetroStation,
      roleType: createUserDto.roleType as Role,
      birthday: createUserDto.birthday
        ? new Date(createUserDto.birthday)
        : undefined,
    }).setPassword(createUserDto.password);

    const user = await this.authRepository.create(userEntity);

    if (!user) {
      throw new BadRequestException('User already exists');
    }

    return user;
  }

  public async refresh(payload: RefreshTokenPayload, token: string) {
    const user = await this.authRepository.read({ id: payload.userId });

    if (!user) {
      throw new UnauthorizedException('The user has been deleted');
    }

    const tokenInfo = await this.authRepository.readRefreshToken(user.id);

    if (
      !token ||
      tokenInfo.token !== token ||
      tokenInfo.expiresAt.getTime() < new Date().getTime()
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    const tokens = await this.createTokenPair(user);

    return tokens;
  }

  public async createTokenPair(user: UserEntity) {
    const days = Number(
      this.configService
        .get<string>('app.jwt.refreshTokenExpiresIn')
        .slice(0, 1),
    );

    const createdAt = new Date();

    const expiresAt = new Date(createdAt.getTime() + 86_400_000 * days);

    const accessTokenPayload = this.createTokenPayload(user);

    const tokenPair = {
      refreshToken: await this.jwtService.signAsync(
        {
          userId: user.id,
          expiresAt,
          createdAt,
        },
        {
          secret: this.configService.get('app.jwt.refreshTokenSecret'),
          expiresIn: this.configService.get('app.jwt.refreshTokenExpiresIn'),
        },
      ),
      accessToken: await this.jwtService.signAsync(accessTokenPayload),
    };

    await this.authRepository.deleteRefreshToken(user.id);

    await this.authRepository.createRefreshToken(
      new RefreshTokenEntity({
        userId: user.id,
        token: tokenPair.refreshToken,
        expiresAt,
        createdAt,
      }),
    );

    return tokenPair;
  }

  public async login(loginDto: LoginDto) {
    const user = await this.authRepository.read({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid login');
    }

    const isPasswordValid = user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login');
    }

    return user;
  }

  public async getUser(userId: string) {
    const user = await this.authRepository.read({ id: userId });

    if (!user) {
      throw new BadRequestException('No user found');
    }

    return user;
  }

  public async createRole(userId: string, role: CreateRoleDto) {
    const user = await this.authRepository.read({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (user.roleType !== role.roleType) {
      throw new BadRequestException('Roles does not match');
    }

    if (user.role) {
      throw new BadRequestException('Role already exists');
    }

    let roleEntity: UserRoleEntity | CoachRoleEntity;

    if (role.roleType === Role.User && role.userRole) {
      roleEntity = await this.authRepository.createUserRole(
        user.id,
        new UserRoleEntity(role.userRole),
      );
    } else if (role.roleType === Role.Coach && role.coachRole) {
      roleEntity = await this.authRepository.createCoachRole(
        user.id,
        new CoachRoleEntity(role.coachRole),
      );
    } else {
      throw new BadRequestException('Invalid role type');
    }

    user.role = roleEntity.toPojo();

    return user;
  }

  public async redactUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.authRepository.read({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    this.checkUpdateRoleType(user, updateUserDto);

    let whatRoleToUpdate: Role | undefined;

    const updateUser = new UserEntity({
      ...user,
      ...updateUserDto,
      birthday: updateUserDto.birthday
        ? new Date(updateUserDto.birthday)
        : user.birthday,
    });

    if (user.role && isUserRole(user.role)) {
      whatRoleToUpdate = Role.User;
      updateUser.role = {
        ...user.role,
        ...updateUserDto,
      };
    } else if (user.role && isCoachRole(user.role)) {
      whatRoleToUpdate = Role.Coach;
      updateUser.role = {
        ...user.role,
        ...updateUserDto,
      };
    }

    const updatedUser = await this.authRepository.update(
      userId,
      updateUser,
      whatRoleToUpdate,
    );

    if (!updateUser) {
      throw new InternalServerErrorException('Transaction error');
    }

    return updatedUser;
  }

  public async getUsers(
    userId: string,
    query: QueryDto,
  ): Promise<UserEntity[]> {
    const user = await this.authRepository.read({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (user.roleType === Role.Coach) {
      throw new UnauthorizedException('Coaches can not acces users info ');
    }

    const limit = query.take ? query.take : DEFAULT_LIMIT;
    const offset = query.page ? query.page * limit : DEFAULT_PAGE * limit;

    const users = await this.authRepository.readUsers(userId, {
      limit,
      offset,
      filters: query,
    });

    return users;
  }

  private createTokenPayload(user: UserEntity): AccessTokenPayload {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUri: user.avatarUri,
      backgroudUri: user.backgroundUri,
    };
  }

  private checkUpdateRoleType(user: UserEntity, updateUserDto: UpdateUserDto) {
    if (
      user.roleType === Role.User &&
      COACH_ROLE_PROPERTIES.some((prop) => updateUserDto.hasOwnProperty(prop))
    ) {
      throw new BadRequestException('Wrong user role type');
    } else if (
      user.roleType === Role.Coach &&
      USER_ROLE_PROPERTIES.some((prop) => updateUserDto.hasOwnProperty(prop))
    ) {
      throw new BadRequestException('Wrong coach role type');
    }
  }
}
