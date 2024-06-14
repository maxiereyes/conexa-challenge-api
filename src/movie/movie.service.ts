import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entitites';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from './dto/movie-response.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(payload: CreateMovieDto) {
    const newMovie = new Movie({
      ...payload,
    });

    const movie = await this.movieRepository.save(newMovie);

    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, payload: UpdateMovieDto) {
    const movie = await this.findById(id);

    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    const updatedMovie = await this.movieRepository.save({
      ...movie,
      ...payload,
    });

    return plainToInstance(MovieResponseDto, updatedMovie, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string) {
    const movie = await this.findById(id);

    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    return await this.movieRepository.delete({ id });
  }

  async findAll() {
    const movies = await this.movieRepository.find();

    return plainToInstance(MovieResponseDto, [movies], {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      return null;
    }

    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }
}
