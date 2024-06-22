import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweet } from 'src/graphql.schema';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: Repository<Tweet>,
  ) {}

  async findAll() {
    return this.tweetsRepository.find();
  }

  create(input: CreateTweet) {
    const tweet = this.tweetsRepository.save(input);
    return tweet;
  }
}
