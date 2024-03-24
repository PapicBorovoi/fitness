import {
  Controller,
  HttpStatus,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Patch,
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
import { AuthService } from './auth.service';
import { fillDto } from 'src/shared/util/common';
import { UserRdo } from './rdo/user.rdo';
import { JWTRefreshGuard } from 'src/shared/guard/jwt-refresh.guard';
import { UserInfoRdo } from './rdo/user-info.rdo';
import { TokenRdo } from './rdo/token.rdo';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryDto } from './dto/query.dto';
import {
  RequestWithAccessPayload,
  RequestWithRefreshPayload,
} from 'src/shared/types/token.type';

@ApiTags('user')
@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'access token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid token',
  })
  @UseGuards(JWTAuthGuard)
  @Get('check')
  public async check(@Req() { user }: RequestWithAccessPayload) {
    const result = await this.authService.check(user);
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
    const result = await this.authService.login(loginDto);
    const tokens = await this.authService.createTokenPair(result);
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
    const result = await this.authService.register(createUserDto);
    const tokens = await this.authService.createTokenPair(result);
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
  public async refresh(@Req() { user, headers }: RequestWithRefreshPayload) {
    const token = headers['authorization'].slice(7);
    const result = await this.authService.refresh(user, token);
    return fillDto(TokenRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched user info',
  })
  @ApiBadRequestResponse({})
  @Get()
  @UseGuards(JWTAuthGuard)
  public async getUser(@Query('id') id: string) {
    const result = await this.authService.getUser(id);
    return fillDto(UserInfoRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully created user role',
  })
  @ApiBadRequestResponse({})
  @Post('role')
  @UseGuards(JWTAuthGuard)
  public async createRole(
    @Body() role: CreateRoleDto,
    @Req() { user }: RequestWithAccessPayload,
  ) {
    const result = await this.authService.createRole(user.userId, role);
    return fillDto(UserInfoRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully updated user info',
  })
  @ApiBadRequestResponse({})
  @UseGuards(JWTAuthGuard)
  @Patch()
  public async redactUser(
    @Req() { user }: RequestWithAccessPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.authService.redactUser(
      user.userId,
      updateUserDto,
    );
    return fillDto(UserInfoRdo, result);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully fetched users',
  })
  @ApiUnauthorizedResponse({})
  @UseGuards(JWTAuthGuard)
  @Get('users')
  public async getUsers(
    @Req() { user }: RequestWithAccessPayload,
    @Query()
    query: QueryDto,
  ) {
    const result = await this.authService.getUsers(user.userId, query);
    return fillDto(UserInfoRdo, result);
  }
}
