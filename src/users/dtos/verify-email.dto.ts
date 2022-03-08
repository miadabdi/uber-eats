import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';

@ArgsType()
export class VerifyEmailDto extends PickType(Verification, ['code'] as const) {}

@ObjectType()
export class VerifyEmailOutput {
  @Field((is) => String)
  message: string;
}
