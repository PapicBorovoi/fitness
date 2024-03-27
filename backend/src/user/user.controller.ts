import {
  Controller,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Post,
  Param,
  Query,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { fillDto } from 'src/shared/util/common';
import { UserService } from './user.service';
import { RequestWithAccessPayload } from 'src/shared/types/token.type';
import { UserRdo } from 'src/auth/rdo/user.rdo';
import { UserBalanceRdo } from './rdo/user-balance.rdo';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched friends',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('friends')
  public async getFriends(
    @Req() { user }: RequestWithAccessPayload,
    @Query('isFriendOf') isFriendOf: boolean,
  ) {
    const result = await this.userService.getFriends(user.userId, isFriendOf);
    return fillDto(UserRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added friend',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Post('friend/:id')
  public async addFriend(
    @Req() { user }: RequestWithAccessPayload,
    @Param('id') id: string,
  ) {
    const result = await this.userService.addFriend(user.userId, id);
    return fillDto(UserRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully deleted friend',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Delete('friend/:id')
  public async deleteFriend(
    @Req() { user }: RequestWithAccessPayload,
    @Param('id') id: string,
  ) {
    const result = await this.userService.deleteFriend(user.userId, id);
    return fillDto(UserRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched balance',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('balance')
  public async getBalance(@Req() { user }: RequestWithAccessPayload) {
    const result = await this.userService.getBalance(user.userId);
    return fillDto(UserBalanceRdo, result);
  }

  @ApiResponse({
    status: 418,
    description: 'succesfully updated balance info',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Patch('balance')
  public async updateBalance(
    @Req() { user }: RequestWithAccessPayload,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    const result = await this.userService.updateBalance(
      user.userId,
      updateBalanceDto,
    );
    return fillDto(UserBalanceRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully created workout',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Post('workout/:id')
  public async addWorkoutToBalance(
    @Req() { user }: RequestWithAccessPayload,
    @Param('id') id: string,
    @Query('num') num: number,
  ) {
    const result = await this.userService.addWorkoutToBalance(
      user.userId,
      id,
      num,
    );
    return fillDto(UserBalanceRdo, result);
  }
}
