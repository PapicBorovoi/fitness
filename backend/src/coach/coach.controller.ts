import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { fillDto } from 'src/shared/util/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { RequestWithAccessPayload } from 'src/shared/types/token.type';
import { WorkoutRdo } from './rdo/workout.rdo';
import { JWTAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutsQueryDto } from './dto/workouts-query.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { WorkoutOrderRdo } from './rdo/workout-order.rdo';

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

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully updated workout',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Patch('workout/:id')
  public async updateWorkout(
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
    @Req() { user }: RequestWithAccessPayload,
  ) {
    const result = await this.coachService.updateWorkout(
      id,
      updateWorkoutDto,
      user.userId,
    );
    return fillDto(WorkoutRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched workout info',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('workout/:id')
  public async getWorkout(@Param('id') id: string) {
    const result = await this.coachService.getWorkout(id);
    return fillDto(WorkoutRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched workouts infos',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('workouts')
  public async getWorkouts(
    @Req() { user }: RequestWithAccessPayload,
    @Query() query: WorkoutsQueryDto,
  ) {
    const result = await this.coachService.getWorkouts(user.userId, query);
    return fillDto(WorkoutRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched orders info',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('orders')
  public async getOrders(
    @Req() { user }: RequestWithAccessPayload,
    @Query() query: OrdersQueryDto,
  ) {
    const result = await this.coachService.getOrders(user.userId, query);
    return fillDto(
      WorkoutOrderRdo,
      result.map((order) => ({
        ...order,
        workout: order.workout.toPojo(),
      })),
    );
  }
}
