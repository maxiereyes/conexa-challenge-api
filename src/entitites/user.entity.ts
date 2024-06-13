import { UserRolesEnum } from 'src/user/enum/user-roles.enum';
import { UserStatusEnum } from 'src/user/enum/user-status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({
    name: 'status',
    default: UserStatusEnum,
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Column({
    name: 'roles',
    nullable: false,
    array: true,
    type: 'enum',
    enum: UserRolesEnum,
  })
  roles: UserRolesEnum[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
