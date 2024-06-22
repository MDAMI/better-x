import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Group as GraphQLGroup } from '../graphql.schema';

@Entity()
export class Group implements GraphQLGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  userIds: string[];

  @Column('simple-array')
  groupIds: string[];
}
