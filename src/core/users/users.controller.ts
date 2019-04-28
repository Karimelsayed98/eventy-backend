import { HashingService } from './../../common/services/hashing.service';
import { User } from './user.model';
import { IRegisterUserDto } from './dto/registerUser.dto';
import { ILoginUserDto } from './dto/loginUser.dto';
import { UserRepository } from './user.repository';
import { PlannerRepository } from './planner.repository';
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { response } from 'express';
import { JwtService } from '@common/services/jwt.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly plannerRepository: PlannerRepository,
    private readonly hashing: HashingService,
    private readonly jwt: JwtService,
  ) {}

  @Post('/register')
  async registerUser(@Body() registerUserDto: IRegisterUserDto) {
    // TODO: Validation
    let user = new User(registerUserDto);

    user.password = await this.hashing.hashPassword(user.password);
    await this.userRepository.save(user);
    response.status(201);
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: ILoginUserDto) {
    //TODO: Validation
    let user = await this.userRepository.findOne({ email: loginUserDto.email });

    if (user.email == undefined) {
      //TODO: log error
      return response.status(400);
    }

    //compare given pw with hashing pw
    if ((await this.hashing.matchingPassword(loginUserDto.password, user.password)) === false) {
      //TODO: log error
      return response.status(400);
    }

    //get user role
    const userPlanner = await this.plannerRepository.findOne({ user });
    const body = {
      role: userPlanner ? 'planner' : 'creator',
      username: user.name,
      useremail: user.email,
    };

    return { token: this.jwt.generateToken(body) };
  }
}
