import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Tweet as GraphQLTweet, TweetCategory } from 'src/graphql.schema';
import { Permission } from 'src/permissions/permission.entity';

@Entity()
@Tree('closure-table', {
  closureTableName: 'tweetClosure',
})
export class Tweet implements GraphQLTweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  authorId: string;

  @Column()
  content: string;

  @Column('simple-array', {
    default: [],
  })
  hashtags: string[];

  @Column({
    nullable: true,
  })
  parentTweetId: string;

  @TreeParent()
  parentTweet: Tweet;

  @TreeChildren()
  childTweets: Tweet[];

  @Column({
    type: 'enum',
    enum: TweetCategory,
    nullable: true,
  })
  category: TweetCategory;

  @Column({
    nullable: true,
  })
  location: string;

  @ManyToOne(() => Permission, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  permission: Permission;
}
