import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

export enum UserTypeEnum {
  USER = 'user',
  GROUP = 'group',
}

@Entity()
@TableInheritance({
  column: { type: 'varchar', name: 'type', enum: UserTypeEnum },
})
export class User {
  @PrimaryColumn()
  id: string;
}
