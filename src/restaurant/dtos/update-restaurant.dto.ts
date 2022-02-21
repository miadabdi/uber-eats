import {
  ArgsType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './create-restaurant.dto';

@ArgsType()
export class UpdateRestaurantDto extends IntersectionType(
  PartialType(CreateRestaurantDto),
  PickType(Restaurant, ['id'] as const),
) {}
