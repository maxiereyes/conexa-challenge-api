import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entitites';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  create(payload: any) {
    return 'create movie';
  }

  update(id: string, payload: any) {
    return 'update movie';
  }

  delete(id: string) {
    return 'delete movie';
  }

  findAll() {
    return 'find all movies';
  }

  findById(id: string) {
    return 'find movie by id';
  }
}
