import { ArgsType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class EditProfileDto extends PartialType(
  PickType(User, ['email', 'password', 'name'] as const),
) {}
