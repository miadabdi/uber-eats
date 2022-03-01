import { Inject, Request, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccessToken, LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => [User])
  users(): User[] {
    return [];
  }

  @Mutation((returns) => User)
  createAccount(@Args() createAccountDto: CreateAccountDto): Promise<User> {
    return this.usersService.createAccount(createAccountDto);
  }

  @Mutation((returns) => AccessToken)
  login(@Args() loginDto: LoginDto): Promise<AccessToken> {
    return this.usersService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => User)
  me(@Request() req): User {
    console.log('Reached resolver');

    return req.user;
  }
}
