import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';

enum RoleEnum {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  DELIVERY = 'DELIVERY',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});

@ArgsType()
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((is) => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field((is) => String)
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field((is) => String, { nullable: true })
  @Column({ select: false })
  @Length(8, 64)
  @Exclude({ toPlainOnly: true })
  password: string;

  @Field((is) => RoleEnum)
  @Column({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @Column({ default: false })
  @Field((is) => Boolean)
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.password);
  }
}
