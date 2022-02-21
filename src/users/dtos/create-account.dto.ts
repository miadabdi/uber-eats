import { ArgsType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class CreateAccountDto extends PickType(
  User,
  ['email', 'password', 'role'] as const,
  ArgsType,
) {}
