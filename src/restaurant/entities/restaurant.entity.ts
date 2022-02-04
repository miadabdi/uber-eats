import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((is) => Number, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Field((is) => String)
  @Column()
  name: string;

  @Field((is) => Boolean)
  @Column()
  isVegan?: boolean;

  @Field((is) => String)
  @Column()
  owner: string;

  @Field((is) => String)
  @Column()
  address: string;
}
