import { ChildEntity, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Group extends User {
  @ManyToMany(() => User, {
    cascade: true,
  })
  @JoinTable()
  userIds: User[];

  @ManyToMany(() => Group)
  @JoinTable()
  groupIds: Group[];
}
