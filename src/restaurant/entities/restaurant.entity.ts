import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((is) => Number, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Field((is) => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  name: string;

  @Field((is) => Boolean, { defaultValue: true })
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVegan: boolean;

  @Field((is) => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  owner: string;

  @Field((is) => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  address: string;

  @Field((is) => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  categoryName: string;
}
