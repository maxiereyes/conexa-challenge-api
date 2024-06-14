import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  episodeId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  openingCrawl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;
}
