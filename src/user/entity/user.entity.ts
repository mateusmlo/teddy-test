import { Url } from '../../url/entity/url.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'ed69714e-b5cf-4a7e-91e7-78097a2e1431' })
  id: string;

  @Column({ unique: true, length: 70 })
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @Column({ length: 70 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @CreateDateColumn()
  @ApiProperty({ example: new Date() })
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: new Date() })
  updatedAt?: Date;
}
