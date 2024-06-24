import { Tweet } from 'src/graphql.schema';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: true,
  })
  inheritViewPermissions: boolean;

  @Column({
    default: true,
  })
  inheritEditPermissions: boolean;

  @Column('simple-array', {
    default: [],
  })
  viewPermissions: String[];

  @Column('simple-array', {
    default: [],
  })
  editPermissions: String[];
}
