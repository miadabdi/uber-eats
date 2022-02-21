import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({ email: loginDto.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await user.checkPassword(loginDto.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is not correct');
    }

    return user;
  }
}
