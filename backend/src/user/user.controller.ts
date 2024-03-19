import {
  Controller,
  HttpStatus,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JWTAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/shared/types/token.type';
import { UserService } from './user.service';
import { fillDto } from 'src/shared/util/common';
import { UserRdo } from './rdo/user.rdo';
import { JWTRefreshGuard } from 'src/shared/guard/jwt-refresh.guard';
import { UserInfoRdo } from './rdo/user-info.rdo';
import { TokenRdo } from './rdo/token.rdo';

interface RequestWithAccessPayload extends Request {
  payload: AccessTokenPayload;
}

interface RequestWithRefreshPayload extends Request {
  payload: RefreshTokenPayload;
}

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'access token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid token',
  })
  @UseGuards(JWTAuthGuard)
  @Get('check')
  public async check(@Req() { payload }: RequestWithAccessPayload) {
    const result = await this.userService.check(payload);
    return fillDto(UserInfoRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully logged in',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Post('login')
  public async login(@Body() loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    const tokens = await this.userService.createTokenPair(result);
    return fillDto(UserRdo, { ...result, ...tokens });
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.register(createUserDto);
    const tokens = await this.userService.createTokenPair(result);
    return fillDto(UserRdo, { ...result, ...tokens });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully refreshed tokens',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @Get('refresh')
  @UseGuards(JWTRefreshGuard)
  public async refresh(@Req() { payload }: RequestWithRefreshPayload) {
    const result = await this.userService.refresh(payload);
    return fillDto(TokenRdo, result);
  }
}
