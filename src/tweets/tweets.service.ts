import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweet } from 'src/graphql.schema';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: Repository<Tweet>,
    private permissionsService: PermissionsService,
  ) {}

  async findAll() {
    return this.tweetsRepository.find();
  }

  create(input: CreateTweet): Promise<Tweet> {
    const tweet = this.tweetsRepository.save(input);
    return tweet;
  }
}
