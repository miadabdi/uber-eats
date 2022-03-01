import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccessToken, LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { PayloadType } from './strategies/jwt.strategy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<User> {
    const emailTaken = await this.userRepository.find({
      email: createAccountDto.email,
    });

    if (emailTaken.length > 0) {
      throw new ConflictException('Email is taken');
    }

    const user = this.userRepository.create(createAccountDto);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<AccessToken> {
    const user = await this.userRepository.findOne({ email: loginDto.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await user.checkPassword(loginDto.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is not correct');
    }

    const payload: PayloadType = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
