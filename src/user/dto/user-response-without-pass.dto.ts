import { ApiProperty } from '@nestjs/swagger';
import { UserRolesEnum } from '../enum/user-roles.enum';
import { UserStatusEnum } from '../enum/user-status.enum';
import { Expose } from 'class-transformer';

export class UserResponseWithoutPassDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  roles: UserRolesEnum[];

  @ApiProperty()
  @Expose()
  status: UserStatusEnum;

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
