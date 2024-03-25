import {
  Controller,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { fillDto } from 'src/shared/util/common';
import { UserService } from './user.service';
import { RequestWithAccessPayload } from 'src/shared/types/token.type';
import { UserRdo } from 'src/auth/rdo/user.rdo';

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
}
