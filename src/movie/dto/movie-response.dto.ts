import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  episodeId: number;

  @ApiProperty()
  @Expose()
  openingCrawl: string;

  @ApiProperty()
  @Expose()
  director: string;

  @ApiProperty()
  @Expose()
  producer: string;

  @ApiProperty()
  @Expose()
  releaseDate: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  deletedAt: Date;
}
