import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Url extends BaseEntity {
  @PrimaryColumn()
  urlId: string;

  @ApiProperty({
    example:
      'https://docs.imperva.com/bundle/on-premises-knowledgebase-reference-guide/page/abnormally_long_url.htm',
  })
  @Column()
  originalUrl: string;

  @Column()
  @ApiProperty({ example: 'http://localhost:3333/XJq82t' })
  shortUrl: string;

  @Column({ default: 0 })
  @ApiProperty({ example: 10 })
  clickCount: number;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  user?: User;

  @DeleteDateColumn()
  @ApiProperty({ example: new Date() })
  deletedAt?: Date;

  @CreateDateColumn()
  @ApiProperty({ example: new Date() })
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: new Date() })
  updatedAt?: Date;
}
