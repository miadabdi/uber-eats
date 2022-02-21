import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(
    @Inject(RestaurantService)
    private readonly restaurantService: RestaurantService,
  ) {}

  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Restaurant)
  createRestaurant(
    @Args() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Mutation((returns) => Restaurant)
  updateRestaurant(
    @Args() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.updateRestaurant(updateRestaurantDto);
  }
}
