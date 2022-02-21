import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, Length } from 'class-validator';

enum RoleEnum {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  DELIVERY = 'DELIVERY',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((is) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((is) => String)
  @Column()
  @Length(8, 64)
  password: string;

  @Field((is) => RoleEnum)
  @Column({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.password);
  }
}
