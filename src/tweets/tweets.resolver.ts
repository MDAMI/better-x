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
    const tweets = this.tweetsService.findAll();
    const paginatedTweets = new PaginatedTweet();
    paginatedTweets.nodes = await tweets;
    return paginatedTweets;
  }

  @Query()
  async canEditTweet(
    @Args('userId') userId: string,
    @Args('tweetId') tweetId: string,
  ): Promise<boolean> {
    //TODO Can Edit
    return this.tweetsService.canEditTweet(userId, tweetId);
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
    return this.tweetsService.updateTweetPermissions(tweetId, input);
  }
}
