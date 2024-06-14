import { ApiProperty } from '@nestjs/swagger';
import { UserRolesEnum } from '../enum/user-roles.enum';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({
    isArray: true,
    enum: UserRolesEnum,
  })
  @Expose()
  roles: UserRolesEnum[];
}
