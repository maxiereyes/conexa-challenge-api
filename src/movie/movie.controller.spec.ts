/* eslint-disable @typescript-eslint/ban-types */
import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entitites';
import { DeleteResult, Repository } from 'typeorm';
import { MovieResponseDto } from './dto/movie-response.dto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  const movieRepositoryToken: string | Function = getRepositoryToken(Movie);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: movieRepositoryToken,
          useValue: Repository,
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
    expect(movieService).toBeDefined();
  });

  it('should return all movies', async () => {
    const mockMovies: MovieResponseDto[] = [
      {
        id: '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
        title: 'test',
        episodeId: 1,
        openingCrawl: 'test',
        director: 'test',
        producer: 'test',
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      {
        id: '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
        title: 'test',
        episodeId: 1,
        openingCrawl: 'test',
        director: 'test',
        producer: 'test',
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    ];

    const mockMoviesDto = mockMovies.map((movie) =>
      plainToInstance(MovieResponseDto, movie, {
        excludeExtraneousValues: true,
      }),
    );

    jest.spyOn(movieService, 'findAll').mockResolvedValueOnce(mockMoviesDto);
    const result = await movieController.findAll();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(mockMovies.length);
    expect(result[0].title).toBe(mockMovies[0].title);
    result.forEach((movie) => {
      expect(movie).toBeInstanceOf(MovieResponseDto);
    });
  });

  it('should return a movie by id', async () => {
    const newMovie = {
      id: '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    const mockMovie = plainToInstance(MovieResponseDto, newMovie, {
      excludeExtraneousValues: true,
    });

    jest.spyOn(movieService, 'findById').mockResolvedValueOnce(mockMovie);
    const result = await movieController.findById(
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );
    expect(result).toBeInstanceOf(MovieResponseDto);
    expect(result.title).toBe(newMovie.title);
  });

  it('should return null if movie not found', async () => {
    jest.spyOn(movieService, 'findById').mockResolvedValueOnce(null);
    const result = await movieController.findById(
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );
    expect(result).toBe(null);
  });

  it('should delete a movie', async () => {
    const deleteResult: DeleteResult = {
      raw: null,
      affected: 1,
    };

    jest.spyOn(movieService, 'delete').mockResolvedValueOnce(deleteResult);
    const result = await movieController.delete(
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );
    expect(result.affected).toBe(1);
  });

  it('should throw an error if movie not found on delete method', () => {
    jest
      .spyOn(movieService, 'delete')
      .mockRejectedValueOnce(new BadRequestException('Movie not found'));
    const result = movieController.delete(
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );
    expect(result).rejects.toThrow(BadRequestException);
  });

  it('should update a movie', async () => {
    const payloadUpdated = {
      title: 'test updated title',
    };
    const movieUpdated = {
      id: '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
      title: 'test',
      episodeId: 1,
      openingCrawl: 'test',
      director: 'test',
      producer: 'test',
      releaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockMovie = plainToInstance(MovieResponseDto, movieUpdated, {
      excludeExtraneousValues: true,
    });

    jest.spyOn(movieService, 'update').mockResolvedValueOnce(mockMovie);
    const result = await movieController.update(
      payloadUpdated,
      '03c90e40-9b28-4c09-9c2a-8bb7ce83fa6d',
    );
    expect(result).toBeInstanceOf(MovieResponseDto);
    expect(result.title).toBe(movieUpdated.title);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });
});
