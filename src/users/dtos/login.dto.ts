import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { CreateAccountDto } from './create-account.dto';

@ArgsType()
export class LoginDto extends PickType(CreateAccountDto, [
  'email',
  'password',
] as const) {}

@ObjectType()
export class AccessToken {
  @Field((is) => String)
  access_token: string;
}
