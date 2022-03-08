import {
  ClassSerializerInterceptor,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GetUser } from './decorators/get-user.decorator';
import { CreateAccountDto } from './dtos/create-account.dto';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { AccessToken, LoginDto } from './dtos/login.dto';
import { UserProfileDto } from './dtos/user-profile.dto';
import { VerifyEmailDto, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { GqlAuthGuard } from './guards/jwt.guard';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver((of) => User)
export class UsersResolver {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

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

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  user(@Args() userProfileDto: UserProfileDto): Promise<User> {
    return this.usersService.findById(userProfileDto.userId);
  }

  @Mutation((returns) => User)
  @UseGuards(GqlAuthGuard)
  async editProfile(
    @Args() editProfileDto: EditProfileDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.editProfile(editProfileDto, user.id);
  }

  @Mutation((returns) => VerifyEmailOutput)
  verifyEmail(
    @Args() verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(verifyEmailDto.code);
  }
}
