import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CoachRepository } from './coach.repository';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/shared/types/app.type';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutEntity } from './entities/workout.entity';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { QueryDto } from './dto/query.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/user/user.const';

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

  public async updateWorkout(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
    userId: string,
  ) {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException('User has been deleted');
    }

    if (user.roleType !== Role.Coach) {
      throw new UnauthorizedException('Only coaches can update workouts');
    }

    const workout = await this.coachRepository.readWorkout(id);

    if (!workout) {
      throw new BadRequestException('Non existent workout');
    }

    const uw = new WorkoutEntity({
      ...workout,
      ...updateWorkoutDto,
    });

    const updatedWorkout = await this.coachRepository.updateWorkout(uw);

    if (!updatedWorkout) {
      throw new InternalServerErrorException('Error while updating workout');
    }

    return updatedWorkout;
  }

  public async getWorkout(id: string) {
    const workout = await this.coachRepository.readWorkout(id);

    if (!workout) {
      throw new BadRequestException('Workout not found');
    }

    return workout;
  }

  public async getWorkouts(userId: string, query: QueryDto) {
    const user = await this.userService.getUser(userId);

    if (user.roleType !== Role.Coach) {
      throw new UnauthorizedException('Invalid role');
    }

    const limit = query.take ? query.take : DEFAULT_LIMIT;
    const offset = query.page ? query.page * limit : query.page * DEFAULT_PAGE;

    const workouts = await this.coachRepository.readWorkouts(userId, {
      filter: query,
      limit,
      offset,
    });

    if (workouts === null) {
      throw new InternalServerErrorException('Error while fetching workouts');
    }

    return workouts;
  }
}
