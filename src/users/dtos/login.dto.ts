import { ArgsType, PickType } from '@nestjs/graphql';
import { CreateAccountDto } from './create-account.dto';

@ArgsType()
export class LoginDto extends PickType(CreateAccountDto, [
  'email',
  'password',
] as const) {}
