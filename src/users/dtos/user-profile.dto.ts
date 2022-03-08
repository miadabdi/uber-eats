import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UserProfileDto {
  @Field((is) => Number)
  userId: number;
}
