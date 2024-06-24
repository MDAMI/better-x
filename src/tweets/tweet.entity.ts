import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tweet as GraphQLTweet, TweetCategory } from 'src/graphql.schema';
import { Permission } from 'src/permissions/permission.entity';

@Entity()
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

  @OneToOne(() => Permission, {
    cascade: true,
  })
  @JoinColumn()
  tweetId: Permission;
}
