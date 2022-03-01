import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccessToken, LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { GqlAuthGuard } from './guards/jwt.guard';
import { UsersService } from './users.service';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    return request.user;
  },
);

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

  @UseGuards(GqlAuthGuard)
  @Query((returns) => User)
  me(@GetUser() user: User): User {
    return user;
  }
}
