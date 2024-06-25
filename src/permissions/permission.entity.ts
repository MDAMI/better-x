import { UpdateTweetPermissions } from 'src/graphql.schema';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  updatePermissions(input: UpdateTweetPermissions) {
    this.editPermissions = input.editPermissions;
    this.viewPermissions = input.viewPermissions;
    this.inheritEditPermissions = input.inheritEditPermissions;
    this.inheritViewPermissions = input.inheritViewPermissions;
  }

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
  viewPermissions: string[];

  @Column('simple-array', {
    default: [],
  })
  editPermissions: string[];
}

export const DEFAULT_PERMISSIONS: UpdateTweetPermissions = {
  inheritViewPermissions: true,
  inheritEditPermissions: true,
  viewPermissions: [],
  editPermissions: [],
};
