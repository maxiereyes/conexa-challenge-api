import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRolesEnum } from '../enum/user-roles.enum';
import { UserStatusEnum } from '../enum/user-status.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'name too short' })
  name?: string;

  @ApiProperty()
  @IsEnum(UserRolesEnum, { each: true })
  @IsOptional()
  roles?: UserRolesEnum[];

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
