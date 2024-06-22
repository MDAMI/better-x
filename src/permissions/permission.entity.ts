import { Tweet } from 'src/graphql.schema';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  @OneToOne(() => Tweet)
  @JoinColumn()
  tweetId: string;

  @Column()
  inheritViewPermissions: boolean;

  @Column()
  inheritEditPermissions: boolean;

  @Column('simple-array')
  viewPermissions: String[];

  @Column('simple-array')
  editPermissions: String[];
}
