/* eslint-disable @typescript-eslint/ban-types */
import { Repository } from 'typeorm';
import { MovieService } from './movie.service';
import { Movie } from '../entitites';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieModule } from './movie.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import typeorm, { connectionSource } from '../config/typeorm';
import { MovieResponseDto } from './dto/movie-response.dto';
import { BadRequestException } from '@nestjs/common';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;
  let module: TestingModule;

  const movieRepositoryToken: string | Function = getRepositoryToken(Movie);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration, typeorm],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            configService.get('typeorm'),
        }),
        MovieModule,
      ],
      providers: [
        MovieService,
        {
          provide: movieRepositoryToken,
          useValue: movieRepository,
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(movieRepositoryToken);

    jest.clearAllMocks();

    movieRepository.delete({});
  });

  it('should create a new movie', async () => {
    const newMovie = {
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
    };

    const movieRepositorySpyOn = jest.spyOn(movieRepository, 'save');

    const result = await movieService.create(newMovie);

    expect(movieRepositorySpyOn).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(MovieResponseDto);
  });

  it('should return an array of movies', async () => {
    const movieRepositorySpyOn = jest.spyOn(movieRepository, 'find');
    const result = await movieService.findAll();

    expect(movieRepositorySpyOn).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a movie by id', async () => {
    const newMovie = {
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
    };

    jest.spyOn(movieRepository, 'save');
    const movieCreated = await movieService.create(newMovie);

    const movieRepositorySpyOn = jest.spyOn(movieRepository, 'findOne');
    const result = await movieService.findById(movieCreated.id);

    expect(movieRepositorySpyOn).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(MovieResponseDto);
  });

  it('should update a movie', async () => {
    const newMovie = {
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
    };

    jest.spyOn(movieRepository, 'save');
    const movieCreated = await movieService.create(newMovie);

    jest.spyOn(movieRepository, 'save');
    const result = await movieService.update(movieCreated.id, {
      title: 'test2',
    });

    expect(result).toBeInstanceOf(MovieResponseDto);
    expect(result.title).toBe('test2');
  });

  it('should delete a movie', async () => {
    const newMovie = {
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
    };

    jest.spyOn(movieRepository, 'save');
    const movieCreated = await movieService.create(newMovie);

    const movieRepositorySpyOn = jest.spyOn(movieRepository, 'delete');
    const result = await movieService.delete(movieCreated.id);

    const movie = await movieService.findById(movieCreated.id);

    expect(movieRepositorySpyOn).toHaveBeenCalledTimes(1);
    expect(result.affected).toBe(1);
    expect(movie).toBe(null);
  });

  it('should return null if movie not found', async () => {
    jest.spyOn(movieRepository, 'findOne');

    const result = await movieService.findById(
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );

    expect(result).toBe(null);
  });

  it('shoudl throw an error if movie not found on delete method', () => {
    jest.spyOn(movieRepository, 'delete');

    expect(
      movieService.delete('03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d'),
    ).rejects.toThrow(BadRequestException);
    expect(movieRepository.delete).toHaveBeenCalledTimes(0);
  });

  it('shoudl throw an error if movie not found on update method', () => {
    jest.spyOn(movieRepository, 'findOne');
    jest.spyOn(movieRepository, 'save');

    expect(
      movieService.update('03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d', {
        title: 'test-updated',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(movieRepository.delete).toHaveBeenCalledTimes(0);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await connectionSource.destroy();
    await module.close();
  });
});
