import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/shared/types/app.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  public async getFriends(userId: string, isFriendOf: boolean) {
    const user = await this.authService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    const friedns = await this.userRepository.readFriends(userId, isFriendOf);

    return friedns;
  }

  public async addFriend(userId: string, friendId: string) {
    const user = await this.authService.getUser(userId);
    const friend = await this.authService.getUser(friendId);

    if (!friend) {
      throw new BadRequestException('No sush user');
    }

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (user.roleType !== Role.User) {
      throw new UnauthorizedException('Only user can add friend');
    }

    const newFriend = await this.userRepository.createFriend(userId, friendId);

    if (!newFriend) {
      throw new InternalServerErrorException('Error while creating friend');
    }

    return friend;
  }
}
