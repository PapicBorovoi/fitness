import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/shared/types/app.type';
import { Method, UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceEntity } from './entities/balance.entity';
import { CoachService } from 'src/coach/coach.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly coachService: CoachService,
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

    if (userId === friendId) {
      throw new BadRequestException('User can not add himself');
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

  public async deleteFriend(userId: string, friendId: string) {
    const user = await this.authService.getUser(userId);
    const friend = await this.authService.getUser(friendId);

    if (!friend) {
      throw new BadRequestException('No sush user');
    }

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (userId === friendId) {
      throw new BadRequestException('User can not delete himself');
    }

    if (user.roleType !== Role.User) {
      throw new UnauthorizedException('Only user can delete friend');
    }

    const deletedFriend = await this.userRepository.deleteFriend(
      userId,
      friendId,
    );

    if (!deletedFriend) {
      throw new InternalServerErrorException('Error while deleting friend');
    }

    return friend;
  }

  public async getBalance(userId: string) {
    const user = await this.authService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (user.roleType !== Role.User) {
      throw new UnauthorizedException('Only users can access balance');
    }

    const balance = await this.userRepository.readBalance(userId);

    return balance;
  }

  public async updateBalance(
    userId: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const balance = await this.getBalance(userId);
    const workout = await this.coachService.getWorkout(
      updateBalanceDto.workoutId,
    );
    const currentNum = balance.workouts.find(
      (w) => w.workout.id === workout.id,
    )?.num;

    if (!currentNum) {
      throw new BadRequestException('Workout not in balance');
    }

    if (
      updateBalanceDto.method === Method.Delete &&
      currentNum - updateBalanceDto.num < 1
    ) {
      await this.userRepository.deleteWorkoutFromBalance(
        balance.id,
        workout.id,
      );
      return new BalanceEntity({
        id: balance.id,
        workouts: balance.workouts.filter((w) => w.workout.id !== workout.id),
      });
    }

    await this.userRepository.updateBalance(
      balance.id,
      updateBalanceDto.workoutId,
      updateBalanceDto.method === Method.Add
        ? updateBalanceDto.num
        : 0 - updateBalanceDto.num,
    );

    return new BalanceEntity({
      id: balance.id,
      workouts: balance.workouts.map((w) => {
        if (w.workout.id === workout.id) {
          return {
            workout: w.workout,
            num:
              updateBalanceDto.method === Method.Add
                ? w.num + updateBalanceDto.num
                : w.num - updateBalanceDto.num,
          };
        }

        return w;
      }),
    });
  }

  public async addWorkoutToBalance(
    userId: string,
    workoutId: string,
    num: number,
  ) {
    if (num < 1 || !num) {
      throw new BadRequestException('Num must be greater than 0');
    }

    const balance = await this.getBalance(userId);

    if (balance.workouts.find((w) => w.workout.id === workoutId)) {
      throw new BadRequestException('Workout already in balance');
    }

    const workout = await this.coachService.getWorkout(workoutId);

    const result = await this.userRepository.addWorkoutToBalance(
      balance.id,
      workoutId,
      num,
    );

    if (!result) {
      throw new InternalServerErrorException(
        'Error while adding workout to balance',
      );
    }

    return new BalanceEntity({
      id: balance.id,
      workouts: [
        ...balance.workouts,
        {
          workout,
          num,
        },
      ],
    });
  }
}
