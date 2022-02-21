import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restuarantRepository: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restuarantRepository.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const newRestaurant = this.restuarantRepository.create(createRestaurantDto);
    return this.restuarantRepository.save(newRestaurant);
  }

  async updateRestaurant(
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restuarantRepository.update(
      updateRestaurantDto.id,
      updateRestaurantDto,
    );

    const restaurant = await this.restuarantRepository.findOne(
      updateRestaurantDto.id,
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }
}
