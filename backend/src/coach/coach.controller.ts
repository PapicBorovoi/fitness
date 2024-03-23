import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { fillDto } from 'src/shared/util/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { RequestWithAccessPayload } from 'src/shared/types/token.type';
import { WorkoutRdo } from './rdo/workout.rdo';
import { JWTAuthGuard } from 'src/shared/guard/jwt-auth.guard';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully created new workout',
  })
  @ApiBadRequestResponse({})
  @Post('workout')
  @UseGuards(JWTAuthGuard)
  public async createWorkout(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @Req() { user }: RequestWithAccessPayload,
  ) {
    const result = await this.coachService.createWorkout(
      user.userId,
      createWorkoutDto,
    );
    return fillDto(WorkoutRdo, result);
  }
}
