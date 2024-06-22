import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TweetsService } from './tweets.service';
import {
  CreateTweet,
  PaginatedTweet,
  UpdateTweetPermissions,
} from 'src/graphql.schema';
import { Tweet } from './tweet.entity';

@Resolver('Tweet')
export class TweetsResolver {
  constructor(private tweetsService: TweetsService) {}

  @Query()
  async paginateTweets(
    @Args('userId') userId: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<PaginatedTweet> {
    //TODO Paginate the tweets
    return new PaginatedTweet();
  }

  @Query()
  async canEditTweet(
    @Args('userId') userId: string,
    @Args('tweetId') tweetId: string,
  ): Promise<boolean> {
    //TODO Can Edit
    return false;
  }

  @Mutation()
  async createTweet(@Args('input') input: CreateTweet): Promise<Tweet> {
    return this.tweetsService.create(input);
  }

  @Mutation()
  async updateTweetPermissions(
    @Args('tweetId') tweetId: string,
    @Args('input') input: UpdateTweetPermissions,
  ): Promise<boolean> {
    //TODO Permission
    return false;
  }
}
