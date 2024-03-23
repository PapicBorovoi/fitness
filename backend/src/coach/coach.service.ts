import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CoachRepository } from './coach.repository';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/shared/types/app.type';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutEntity } from './entities/workout.entity';

@Injectable()
export class CoachService {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly userService: UserService,
  ) {}

  public async createWorkout(
    userId: string,
    createWorkoutDto: CreateWorkoutDto,
  ) {
    const user = await this.userService.getUser(userId);

    if (user.roleType !== Role.Coach) {
      throw new BadRequestException('Only coaches can create workouts');
    }

    const workoutEntity = new WorkoutEntity({
      ...createWorkoutDto,
      rating: 0,
      backgroundUri: 'random',
      coachId: user.id,
    });

    const nw = await this.coachRepository.createWorkout(workoutEntity);

    if (!nw) {
      throw new InternalServerErrorException('Error while creating workout');
    }

    return nw;
  }
}
