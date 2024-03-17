import { Controller, HttpStatus, Get, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor() {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'access token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid token',
  })
  @Get()
  public async check() {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully logged in',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Post()
  public async login(@Body() loginDto: LoginDto) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  @Post()
  public async register(@Body() createUserDto: CreateUserDto) {}
}
