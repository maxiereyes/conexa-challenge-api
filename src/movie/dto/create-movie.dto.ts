import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  episodeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  openingCrawl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  releaseDate: Date;
}
