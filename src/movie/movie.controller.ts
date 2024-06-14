import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRolesEnum } from 'src/user/enum/user-roles.enum';
import { ApiResponseSuccessCustom } from 'src/common/decorator/response-success-custom.decorator';
import { MovieResponseDto } from './dto/movie-response.dto';
import { ExceptionFilterDto } from 'src/common/exception-filters/exception-filter';

@Controller('movie')
@ApiTags('Movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRolesEnum.ADMIN)
  @Post()
  @ApiResponseSuccessCustom(MovieResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  async create(@Body() payload: any) {
    return await this.movieService.create(payload);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRolesEnum.ADMIN)
  @Patch(':id')
  @ApiResponseSuccessCustom(MovieResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  async update(@Body() payload: any, @Param('id') id: string) {
    return await this.movieService.update(id, payload);
  }

  @Get()
  @ApiResponseSuccessCustom(MovieResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  async findAll() {
    return await this.movieService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRolesEnum.USER)
  @Get(':id')
  @ApiResponseSuccessCustom(MovieResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  async findById(@Param('id') id: string) {
    return await this.movieService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRolesEnum.ADMIN)
  @Delete(':id')
  @ApiResponseSuccessCustom(MovieResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  async delete(@Param('id') id: string) {
    return await this.movieService.delete(id);
  }
}
