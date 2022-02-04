import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((returns) => Restaurant)
  myRestaurant(): Restaurant {
    return {
      isVegan: true,
      name: 'Pizza Home',
      owner: 'miad',
      address: 'tehran',
    };
  }

  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly?: boolean): Restaurant[] {
    return [];
  }

  @Mutation((returns) => Restaurant)
  createRestaurant(
    @Args() createRestaurantInput: CreateRestaurantDto,
  ): Restaurant {
    return createRestaurantInput;
  }
}
