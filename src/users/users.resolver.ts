import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';
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

  @Mutation((returns) => User)
  login(@Args() loginDto: LoginDto): Promise<User> {
    return this.usersService.login(loginDto);
  }
}
