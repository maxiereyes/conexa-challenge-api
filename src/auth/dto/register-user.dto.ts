import { ApiProperty } from '@nestjs/swagger';
import { UserRolesEnum } from '../../user/enum/user-roles.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password too short' })
  @MaxLength(20, { message: 'password too long' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'name too short' })
  name: string;

  @ApiProperty()
  @IsEnum(UserRolesEnum, { each: true })
  @IsNotEmpty()
  roles: UserRolesEnum[];
}
