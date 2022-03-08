import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { AccessToken, LoginDto } from './dtos/login.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { PayloadType } from './strategies/jwt.strategy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<User> {
    const emailTaken = await this.userRepository.find({
      email: createAccountDto.email,
    });

    if (emailTaken.length > 0) {
      throw new ConflictException('Email is taken');
    }

    // create user
    const user = await this.userRepository.save(
      this.userRepository.create(createAccountDto),
    );

    // create verification code
    const verification = await this.verificationRepository.save(
      this.verificationRepository.create({ user }),
    );

    // send email with verification code to verify email
    // we don't await cause we don't care if email is sent before response is sent back to user
    this.mailService.sendConfirmEmail(
      user,
      `http://localhost:3000/confirm?code=${verification.code}`,
    );

    return user;
  }

  async login(loginDto: LoginDto): Promise<AccessToken> {
    const user = await this.userRepository.findOne(
      { email: loginDto.email },
      { select: ['id', 'password'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check for password
    const isPasswordCorrect = await user.checkPassword(loginDto.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is not correct');
    }

    // create payload to signed
    const payload: PayloadType = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async editProfile(
    editProfileDto: EditProfileDto,
    userId: number,
  ): Promise<User> {
    const user = await this.findById(userId);
    const updatedUser = this.userRepository.merge(user, editProfileDto);
    return this.userRepository.save(updatedUser);
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    const verification = await this.verificationRepository.findOne(
      { code },
      { relations: ['user'] },
    );

    if (!verification) {
      throw new BadRequestException('Verification code not found or expired');
    }

    // set verified to true and delete verification record
    verification.user.verified = true;
    await this.userRepository.save(verification.user);
    await this.verificationRepository.delete(verification.id);

    return {
      message: 'Verification successful',
    };
  }
}
