import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tweet as GraphQLTweet, TweetCategory } from 'src/graphql.schema';

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

  @Column('simple-array')
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

  @Column()
  location: string;
}
