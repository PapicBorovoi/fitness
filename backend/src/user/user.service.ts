import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/shared/types/token.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Gender, MetroStation, Role } from '../shared/types/app.type';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async check(payload: AccessTokenPayload) {
    const foundUser = await this.userRepository.read({
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

    const user = await this.userRepository.create(userEntity);

    if (!user) {
      throw new BadRequestException('User already exists');
    }

    return user;
  }

  public async refresh(payload: RefreshTokenPayload, token: string) {
    const user = await this.userRepository.read({ id: payload.userId });

    if (!user) {
      throw new UnauthorizedException('The user has been deleted');
    }

    const tokenInfo = await this.userRepository.readRefreshToken(user.id);

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
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() *
        86_400_000 *
        Number(
          this.configService
            .get<string>('app.jwt.refreshTokenExpiresIn')
            .slice(0, 1),
        ),
    );

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

    await this.userRepository.deleteRefreshToken(user.id);

    await this.userRepository.createRefreshToken(
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
    const user = await this.userRepository.read({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid login');
    }

    const isPasswordValid = user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login');
    }

    return user;
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
}