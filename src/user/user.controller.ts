import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccessCustom } from 'src/common/decorator/response-success-custom.decorator';
import { ExceptionFilterDto } from 'src/common/exception-filters/exception-filter';
import { UserResponseWithoutPassDto } from './dto/user-response-without-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRolesEnum } from './enum/user-roles.enum';

@ApiBearerAuth()
@Controller('user')
@ApiTags('User')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRolesEnum.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponseSuccessCustom(UserResponseWithoutPassDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponseSuccessCustom(UserResponseWithoutPassDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.delete(id);
  }
}
